require 'faker'
SeedFu.quiet = true

Faker::Config.random = Random.new(42)
Faker::Config.locale = 'en-US'

N_STUDENTS = 10000

N_SINGLE_PARENTS = (N_STUDENTS / 10).round
N_MARRIED_PARENTS = N_STUDENTS - N_SINGLE_PARENTS

N_HUSBANDS = (N_MARRIED_PARENTS / 2).round
N_WIVES = N_HUSBANDS

N_TEACHERS = (N_STUDENTS / 20).round
N_STAFF = (N_TEACHERS / 4).round



ExternalId = Faker::UniqueGenerator.new(
  ->{ Faker::DrivingLicence.uk_driving_licence[0..8] },
1000)


#
# Helpers
#

def set_name_and_email(user, last_name = nil, gender = nil)
  case gender
  when :m
    first_name = Faker::Name.male_first_name
    last_name = last_name || Faker::Name.male_last_name
  when :f
    first_name = Faker::Name.female_first_name
    last_name = last_name || Faker::Name.female_last_name
  else
    first_name = Faker::Name.first_name
    last_name = last_name || Faker::Name.last_name
  end

  user[:first_name] = first_name
  user[:last_name] = last_name
  user[:email] = Faker::Internet.safe_email(name: "#{first_name} #{last_name} #{Faker::Number.unique.hexadecimal(digits: 4)}")
  user
end

def build_user
  user = {
    id: Faker::Internet.uuid,
    mobile_number: Faker::PhoneNumber.unique.cell_phone_in_e164
  }
  set_name_and_email(user)
end

def build_parent_child(parent, child)
  {
    id: Faker::Internet.uuid,
    parent_user_id: parent[:id],
    child_user_id: child[:id]
  }
end

def build_location_account(location, user, role, title = nil)
  {
    id: Faker::Internet.uuid,
    external_id: ExternalId.call,
    location_id: location.id,
    user_id: user[:id],
    role: role,
    title: title
  }
end

def build_cohort(location, name, category)
  {
    id: Faker::Internet.uuid,
    location_id: location.id,
    name: name,
    category: category
  }
end

def build_cohort_user(cohort, user)
  {
    id: Faker::Internet.uuid,
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

def build_greenlight_status(user, set_at, expires_at, status = nil)
  {
    id: Faker::Internet.uuid,
    user_id: user[:id],
    status_set_at: set_at,
    status_expires_at: expires_at,
    status: status || ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'absent', 'unknown'].sample
  }
end

def event_for_status(status)
  case status
  when 'yellow'
    ['fever', 'new_cough', 'difficulty_breathing', 'fever', 'chills', 'taste_smell'].sample
  when 'red'
    ['covid_test_positive', 'covid_diagnosis'].sample
  else
    'none'
  end
end

def build_medical_event(user, occurred_at, status)
  {
    id: Faker::Internet.uuid,
    user_id: user[:id],
    occurred_at: occurred_at,
    event_type: event_for_status(status)
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
  if status == 'red'
    statuses[-3][:status] = 'yellow'
    events << build_medical_event(user, statuses[-3][:status_set_at], 'yellow')

    statuses[-2][:status] = 'yellow'
    events << build_medical_event(user, statuses[-2][:status_set_at], 'yellow')
    statuses[-1][:status] = 'red'
    events << build_medical_event(user, statuses[-1][:status_set_at], 'red')
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
  colors = %w[red  yellow absent unknown]
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
    s, e = build_greenlight_statuses(u, 'green')
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

users = [teachers, staff, single_parents, husbands, wives, students].flatten

puts "Building cohorts"
soccer_team = build_cohort(location, 'Soccer Team', 'activities')
football_team = build_cohort(location, 'Football Team', 'activities')

freshman = build_cohort(location, 'Freshman', 'grade')
sophomore = build_cohort(location, 'Sophomore', 'grade')
junior = build_cohort(location, 'Junior', 'grade')
senior = build_cohort(location, 'Senior', 'grade')

cohorts_users = []
freshmen, sophomores, juniors, seniors = build_cohorts_users(students.shuffle, [30, 25, 24, 21], [freshman, sophomore, junior, senior])
cohorts_users += [freshmen, sophomores, juniors, seniors]
cohorts_users += build_cohorts_users(students.sample(100), [50, 50], [soccer_team, football_team])
cohorts_users += build_cohorts_users(teachers.shuffle, [30, 25, 24, 21], [freshman, sophomore, junior, senior])
cohorts_users = cohorts_users.flatten
cohorts = [soccer_team, football_team, freshman, sophomore, junior, senior].flatten

puts "Building location accounts"

location_accounts = []

teachers.each { |t|
  location_accounts << build_location_account(location, t, 'teacher', [
    'History Teacher',
    'Spanish Teacher',
    'English Teacher',
    'ESL Teacher',
    'Math Teacher',
    'Science Teacher'
  ].sample)
}

staff.each { |s|
  location_accounts << build_location_account(location, s, 'staff', [
    'Administrator',
    'Secretary',
    'Secretary',
    'Custodian',
    'Custodian',
    'Secretary'
  ].sample)
}

{
  'Freshman' => freshmen,
  'Sophomore' => sophomores,
  'Junior' => juniors,
  'Senior' => seniors
}.each do |title, group|
  group.each do |s|
    # s is actual a cohorts_users record
    location_accounts << build_location_account(location, { id: s[:user_id] } , 'student', title)
  end
end

puts "Building greenlight statuses"
greenlight_statuses, medical_events = assign_gl_statuses([staff, teachers, students].flatten)

puts "Seeding data"
# Parallel.each([
#   -> { User.seed(:id, :email, :mobile_number, users) },
#   -> { Cohort.seed(:name, :category, cohorts) }
# ]) { |x| x.call }

# Parallel.each([
#  -> { ParentChild.seed(:parent_user_id, :child_user_id, parents_children) },
#  -> { LocationAccount.seed(:user_id, :location_id, location_accounts) },
#  -> { CohortUser.seed(:cohort_id, :user_id, cohorts_users) },
#  -> { GreenlightStatus.seed(:id, greenlight_statuses) },
#  -> { MedicalEvent.seed(:id, medical_events) unless medical_events.empty? }
# ]) { |x| x.call }

User.seed(:id, :email, :mobile_number, users)
Cohort.seed(:id, cohorts)
ParentChild.seed(:id, parents_children)
LocationAccount.seed(:id, location_accounts)
CohortUser.seed(:id, cohorts_users)
GreenlightStatus.seed(:id, greenlight_statuses)
MedicalEvent.seed(:id, medical_events) unless medical_events.empty?

SeedFu.quiet = false