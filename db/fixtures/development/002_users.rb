require 'faker'
SeedFu.quiet = true

Faker::Config.random = Random.new(42)
Faker::Config.locale = 'en-US'

N_STUDENTS = 100

N_SINGLE_PARENTS = (N_STUDENTS / 10).round
N_MARRIED_PARENTS = N_STUDENTS - N_SINGLE_PARENTS

N_HUSBANDS = (N_MARRIED_PARENTS / 2).round
N_WIVES = N_HUSBANDS

N_TEACHERS = (N_STUDENTS / 20).round
N_STAFF = (N_TEACHERS / 4).round


@location_id_seq = Location.id_seq
@user_id_seq = User.id_seq
@location_account_id_seq = LocationAccount.id_seq
@parent_child_id_seq = ParentChild.id_seq
@cohort_user_id_seq = CohortUser.id_seq
@cohort_id_seq = Cohort.id_seq
@greenlight_status_id_seq = GreenlightStatus.id_seq
@medical_event_id_seq = MedicalEvent.id_seq


ExternalId = Faker::UniqueGenerator.new(
  ->{ Faker::DrivingLicence.uk_driving_licence[0..8] },
1000)


#
# Helpers
#

def set_name_and_email(user, gender = nil, last_name = nil)
  case gender
  when :m
    first_name = Faker::Name.male_first_name
  when :f
    first_name = Faker::Name.female_first_name
  else
    first_name = Faker::Name.first_name
  end

  last_name = last_name || Faker::Name.last_name

  user[:first_name] = first_name
  user[:last_name] = last_name
  user[:email] = Faker::Internet.safe_email(name: "#{first_name} #{last_name} #{Faker::Number.unique.hexadecimal(digits: 4)}")
  user
end

def build_user
  user = {
    id: @user_id_seq.next(),
    mobile_number: Faker::PhoneNumber.unique.cell_phone_in_e164,
    completed_welcome_at: ((1..10).to_a.sample).days.ago
  }
  set_name_and_email(user)
end

def owner_user
  @owner ||= {
    id: @user_id_seq.next(),
    first_name: 'Lucinda',
    last_name: 'Verdella',
    email: 'lucinda@greenwood.org',
    mobile_number: Faker::PhoneNumber.unique.cell_phone_in_e164,
    password: 'asdfasdf',
    completed_welcome_at: ((1..10).to_a.sample).days.ago
  }
end


def build_parent_child(parent, child)
  {
    id: @parent_child_id_seq.next(),
    parent_id: parent[:id],
    child_id: child[:id]
  }
end

def build_location_account(location, user, role)
  {
    id: @location_account_id_seq.next(),
    external_id: ExternalId.call,
    location_id: location.id,
    user_id: user[:id],
    role: role,
  }
end

def build_owner_account(location, user, role)
  {
    id: @location_account_id_seq.next(),
    external_id: ExternalId.call,
    location_id: location.id,
    user_id: user[:id],
    role: role,
    permission_level: 'owner'
  }
end

def build_cohort(location, name, category)
  {
    id: @cohort_id_seq.next(),
    location_id: location.id,
    name: name,
    category: category
  }
end

def build_cohort_user(cohort, user)
  {
    id: @cohort_user_id_seq.next(),
    cohort_id: cohort[:id],
    user_id: user[:id],
  }
end

def build_cohorts_users(users, percentages, cohorts)
  raise "Not 100%" unless percentages.inject(0, :+) == 100
  ns = percentages.map { |p| (p * 0.01 * users.size).round }
  ns[-1] = users.size - ns[0..-2].inject(0, :+)
  users_cohorts = []
  cohorts.zip(ns).each do |cohort, n|
    user_cohort = []
    users.pop(n).each do |user|
      user_cohort << build_cohort_user(cohort, user)
    end
    users_cohorts.push(user_cohort)
  end
  users_cohorts
end

def build_greenlight_status(user, submitted_at, expiration_date, status = nil)
  {
    id: @greenlight_status_id_seq.next(),
    user_id: user[:id],
    submission_date: submitted_at.to_date,
    follow_up_date: submitted_at.to_date + 1.day,
    expiration_date: expiration_date,
    status: status || ['cleared', 'cleared', 'cleared', 'cleared', 'cleared', 'cleared', 'cleared', 'absent', 'unknown'].sample
  }
end

def event_for_status(status)
  case status
  when 'pending'
    ['fever', 'new_cough', 'difficulty_breathing', 'fever', 'chills', 'taste_smell'].sample
  when 'recovery'
    ['covid_test_positive', 'covid_diagnosis'].sample
  else
    'none'
  end
end

def build_medical_event(user, status, status_color)
  {
    id: @medical_event_id_seq.next(),
    greenlight_status_id: status[:id],
    user_id: user[:id],
    occurred_at: status[:started_at],
    event_type: event_for_status(status_color)
  }
end

def build_greenlight_statuses(user, status)
  dates = (0...10).map { |d|
    DateTime.now.prev_day(d)
  }

  statuses = dates.map { |d|
    build_greenlight_status(user, d, d + 1.day)
  }
  events = []
  if status == 'recovery'
    statuses[-3][:status] = 'pending'
    events << build_medical_event(user, statuses[-3], 'pending')

    statuses[-2][:status] = 'pending'
    events << build_medical_event(user, statuses[-2], 'pending')
    statuses[-1][:status] = 'recovery'
    events << build_medical_event(user, statuses[-1], 'recovery')
  end

  if status == 'absent'
    statuses[-3][:status] = 'absent'
    statuses[-2][:status] = 'absent'
    statuses[-1][:status] = 'absent'
  end

  if status == 'unknown'
    statuses[-1][:status] = 'unknown'
  end

  statuses = statuses.filter { |s| s[:status] != 'unknown' }

  [statuses, events]
end

def assign_gl_statuses(users)
  n = users.size
  colors = %w[red  pending absent unknown]
  counts =   [0.5, 3,     4,     7].map { |x| x * 0.01 * users.size }

  statuses = []
  events = []
  users_to_assign = users.shuffle
  colors.zip(counts).each do |c, k|
    users_to_assign.pop(k).each do |u|
      s, e = build_greenlight_statuses(u, c)
      statuses += s
      events += e
    end
  end

  users_to_assign.each do |u|
    s, e = build_greenlight_statuses(u, 'cleared')
    statuses += s
    events += e
  end
  [statuses, events]
end

#
# Seeding
#

location = Location.find_by!(permalink: 'greenwood-lakes')

puts "Building users"

parents_children = []
students = []

teachers, staff, single_parents, husbands, wives = [
  N_TEACHERS, N_STAFF, N_SINGLE_PARENTS, N_HUSBANDS, N_WIVES
].map { |n| Array.new(n) { build_user } }

husbands.zip(wives).each do |h, w|
  s = build_user
  set_name_and_email(h, :m)
  set_name_and_email(w, :f, h[:last_name])
  students << s
  parents_children << build_parent_child(h, s)
  parents_children << build_parent_child(w, s)
end

single_parents.each do |p|
  s = build_user
  s[:last_name] = p[:last_name]
  students << s
  parents_children << build_parent_child(p, s)
end

teachers.sample((N_TEACHERS / 20).round).each do |t|
  s = build_user
  s[:last_name] = t[:last_name]
  students << s
  parents_children << build_parent_child(t, s)
end

users = [teachers, staff, single_parents, husbands, wives, students, owner_user].flatten

puts "Building cohorts"
soccer_team = location.cohorts.find_by!(category: 'Activities', name: 'Soccer Team')
football_team = location.cohorts.find_by!(category: 'Activities', name: 'Football Team')

freshman = location.cohorts.find_by!(category: 'Grade', name: 'Freshman')
sophomore = location.cohorts.find_by!(category: 'Grade', name: 'Sophomore')
junior = location.cohorts.find_by!(category: 'Grade', name: 'Junior')
senior = location.cohorts.find_by!(category: 'Grade', name: 'Senior')

cohorts_users = []
freshmen, sophomores, juniors, seniors = build_cohorts_users(students.shuffle, [30, 25, 24, 21], [freshman, sophomore, junior, senior])
cohorts_users += [freshmen, sophomores, juniors, seniors]
cohorts_users += build_cohorts_users(students.sample(100), [50, 50], [soccer_team, football_team])
cohorts_users += build_cohorts_users(teachers.shuffle, [30, 25, 24, 21], [freshman, sophomore, junior, senior])
cohorts_users = cohorts_users.flatten
cohorts = [soccer_team, football_team, freshman, sophomore, junior, senior].flatten

puts "Building location accounts"

location_accounts = []
# [
#   'History Teacher',
#   'Spanish Teacher',
#   'English Teacher',
#   'ESL Teacher',
#   'Math Teacher',
#   'Science Teacher'
# ].sample
teachers.each { |t|
  location_accounts << build_location_account(location, t, 'teacher')
}
# [
#   'Administrator',
#   'Secretary',
#   'Secretary',
#   'Custodian',
#   'Custodian',
#   'Secretary'
# ].sample

staff.each { |s|
  location_accounts << build_location_account(location, s, 'staff')
}

{
  'Freshman' => freshmen,
  'Sophomore' => sophomores,
  'Junior' => juniors,
  'Senior' => seniors
}.each do |title, group|
  group.each do |s|
    # s is actual a cohorts_users record
    location_accounts << build_location_account(location, { id: s[:user_id] }, 'student')
  end
end

location_accounts << build_owner_account(location, owner_user, 'staff')

puts "Building greenlight statuses"
greenlight_statuses, medical_events = assign_gl_statuses([staff, teachers, students].flatten)

puts "Seeding data"

User.seed(:id, :email, :mobile_number, users)
ParentChild.seed(:id, parents_children)
LocationAccount.seed(:id, location_accounts)
CohortUser.seed(:id, cohorts_users)
GreenlightStatus.seed(:id, greenlight_statuses)
MedicalEvent.seed(:id, medical_events) unless medical_events.empty?

SeedFu.quiet = false
