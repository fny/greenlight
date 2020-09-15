# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


if Rails.env.development?

  puts "WHAT THE FUCK"

  require 'faker'
  require 'json'
  require 'pp'

  N_PARENTS = 100


  location = Location.create!(
    name: 'Greenwood Lakes High School',
    permalink: 'greenwood-lakes',
    email: 'help@glhs.org',
    phone_number: '+14073238891',
    zip_code: '32779',
    category: 'school'
  )


  def set_statuses(user, length, color)
    dates = (0...length).map { |d|
      DateTime.now.prev_day(d)
    }

    statuses = dates.map { |d| 
      GreenlightStatus.new(status_set_at: d, status_expires_at: d + 1.day)
    }

    medical_events = []

    if color == 'red'
      statuses[-3].status = 'yellow'
      medical_events.push(
        Fabricate.build(:yellow_medical_event, occurred_at: statuses[-3].status_set_at)
      )
      statuses[-2].status = 'yellow'
      medical_events.push(
        Fabricate.build(:yellow_medical_event, occurred_at: statuses[-2].status_set_at)
      )
      statuses[-1].status = 'red'
      medical_events.push(
        Fabricate.build(:red_medical_event, occurred_at: statuses[-1].status_set_at)
      )
    end

    if color == 'absent'
      statuses[-3].status = 'absent'
      statuses[-2].status = 'absent'
      statuses[-1].status = 'absent'
    end
    if color == 'unknown'
      statuses[-1].status = 'unknown'
    end
    user.medical_events = medical_events
    user.greenlight_statuses = statuses
  end

  #
  # Set up parents
  #
  puts "parents"
  single_parents = Array.new((N_PARENTS * 0.10).round) { Fabricate.build(:user) }

  husbands = Array.new(N_PARENTS) { 
    Fabricate.build(:user, first_name: Faker::Name.male_first_name)
  }

  wives = husbands.map { |h| 
    Fabricate.build(:user, first_name: Faker::Name.female_first_name)
  }

  parents = [single_parents, husbands, wives].flatten

  #
  # Children
  #

  puts "children"
  single_parents.each do |parent|
    child = Fabricate.build(:user)
    child.last_name = parent.last_name
    parent.children << child
    child.parents << parent
  end

  husbands.zip(wives).each do |h, w|
    children = Array.new(2) { Fabricate.build(:user) }
    children.each { |c| c.parents = [h, w ]}
    h.children = children
    w.children = children
  end

  children = parents.flat_map(&:children)

  #
  # Teachers and Staff
  #

  teachers = Array.new((children.size / 30).round) { Fabricate.build(:user) }
  teachers = [teachers + parents.sample(10)].flatten
  staff = Array.new((teachers.size / 3).round) { Fabricate.build(:user) }

  #
  # Assign Statuses
  #

  def assign_gl_statuses(users)
    n = users.size
    n_red = (0.5 * 0.01 * n).round
    n_yellow = (3 * 0.01 * n).round
    n_absent = (4 * 0.01 * n).round
    n_unknown = (7 * 0.01 * n).round

    users_to_assign = users.shuffle

    users_to_assign.pop(n_red).each do |u|
      set_statuses(u, 10, 'red')
    end

    users_to_assign.pop(n_yellow).each do |u|
      set_statuses(u, 10, 'yellow')
    end

    users_to_assign.pop(n_absent).each do |u|
      set_statuses(u, 10, 'absent')
    end

    users_to_assign.pop(n_unknown).each do |u|
      set_statuses(u, 10, 'unknown')
    end
    users_to_assign.each do |u|
      set_statuses(u, 10, 'green')
    end
  end

  assign_gl_statuses(children)
  assign_gl_statuses(teachers)
  assign_gl_statuses(staff)

  soccer_team = Cohort.new(name: 'Soccer Team', category: 'activities', location: location)
  football_team = Cohort.new(name: 'Football Team', category: 'activities', location: location)

  freshmen = Cohort.new(name: 'Freshmen', category: 'grade', location: location)
  sophomore = Cohort.new(name: 'Sophomore', category: 'grade', location: location)
  junior = Cohort.new(name: 'Junior', category: 'grade', location: location)
  senior = Cohort.new(name: 'Senior', category: 'grade', location: location)

  cohorts = [freshmen, sophomore, junior, senior, soccer_team, football_team]

  def assign_cohorts(users, percentages, cohorts)
    raise "Not 100%" unless percentages.inject(0, :+) == 100
    ns = percentages.map { |p| (p * 0.01 * users.size).round }
    ns[-1] = users.size - ns[0..-2].inject(0, :+)

    cohorts.zip(ns).each do |cohort, n|
      users.pop(n).each do |user|
        user.cohorts << cohort
        cohort.users << user
      end
    end
  end

  assign_cohorts(children.shuffle, [30, 25, 24, 21], [freshmen, sophomore, junior, senior])
  assign_cohorts(children.sample(100), [50, 50], [soccer_team, football_team])
  assign_cohorts(teachers.shuffle, [30, 25, 24, 21], [freshmen, sophomore, junior, senior])

  teachers.each { |t| t.location_accounts.build(
    role: 'teacher', location: location, title: [
        'History Teacher',
        'Spanish Teacher',
        'English Teacher',
        'ESL Teacher',
        'Math Teacher',
        'Science Teacher'
      ].sample
    )
  }

  staff.each { |t| t.location_accounts.build(
    role: 'staff', location: location, title: [
        'Administrator',
        'Secretary',
        'Secretary',
        'Custodian',
        'Custodian',
        'Secretary'
      ].sample
    )
  }

  children.each { |t| t.location_accounts.build(
    role: 'std', location: location)
  }

  ActiveRecord::Base.transaction do
    users [children, teachers, parents].flatten
    users.each_with_index { |u, i|
      puts "#{i}/#{users.size} #{u.first_name}"
      u.save
    }
  end
end
