require 'faker'
require 'json'
require 'pp'

class Dummy
  def self.create(&block)
    d = Dummy.new
    d.instance_eval(&block)

    d.klass
  end


  attr_reader :klass

  def initialize
    @klass = Class.new do
      class << self
        attr_accessor :columns
      end

      def initialize(**attrs)
        attrs.each do |k, v|
          self.send("#{k}=", v)
        end
      end

      self.columns = []

      def to_h
        self.class.columns.each_with_object({}) do |col, hash|
          hash[col] = send(col)
        end
      end

      def to_json
        to_h.to_json
      end
    end

    @klass.class_variable_set(:@@columns, [])
  end

  def method_missing(method, *args, &block)
    @klass.columns << method
    @klass.instance_eval do
      define_method("#{method}=") do |value|
        instance_variable_set("@#{method}", value)
      end

      define_method(method) do

        if instance_variable_defined?("@#{method}")
          return instance_variable_get("@#{method}")
        end
        instance_variable_set("@#{method}", block.call)
      end
    end
  end
end

User = Dummy.create do
  first_name { Faker::Name.first_name }
  last_name { Faker::Name.last_name }
  email { Faker::Internet.unique.email }
  mobile_number { Faker::PhoneNumber.unique.cell_phone_in_e164 }
  parents { [] }
  children { [] }
  greenlight_statuses { [] }
  medical_events { [] }
  location_accounts { [] }
  cohorts { [] }
end

GreenlightStatus = Dummy.create do
  status {
    ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'absent', 'unknown'].sample
  }

  status_set_at { DateTime.now }
  status_expires_at { DateTime.now.next_day(1) }
end

YellowMedicalEvent = Dummy.create do
  event_type { 
    ['fever', 'new_cough', 'difficulty_breathing', 'fever', 'chills', 'taste_smell'].sample
  }
  occurred_at {
    DateTime.now
  }
end

RedMedicalEvent = Dummy.create do
  event_type {
    ['covid_test_positive', 'covid_diagnosis'].sample
  }
  occurred_at {
    DateTime.now
  }
end

Location = Dummy.create do
  name { 'Greenwood Lakes High School' }
  permalink { 'greenwood-lakes' }
  email { 'help@glhs.org' }
  phone_number { '+14073238891' }
  zip_code { '32779' }
  category { 'school' }
  location_accounts { [] }
end

LocationAccount = Dummy.create do
  user { nil }
  location { nil }
  role { nil }
  attendance_status { 'attending' }
  approved_by_user_at { DateTime.now }
  approved_by_location_at { DateTime.now }
end

Cohort = Dummy.create do
  name { nil }
  category { nil }
  users { [] }
end

['green', 'green', 'green', 'green', 'green', 'green', 'absent', 'unknown']

def set_statuses(user, length, color)
  dates = (0...length).map { |d|
    DateTime.now.prev_day(d)
  }

  statuses = dates.map { |d| 
    g = GreenlightStatus.new
    g.status_set_at = d
    g.status_expires_at = d.next_day
    g
  }

  medical_events = []

  if color == 'red'
    statuses[-3].status = 'yellow'
    medical_event = YellowMedicalEvent.new
    medical_event.occurred_at = statuses[-3].status_set_at
    medical_events.push(medical_event)
    statuses[-2].status = 'yellow'
    medical_event = YellowMedicalEvent.new
    medical_event.occurred_at = statuses[-2].status_set_at
    medical_events.push(medical_event)
    statuses[-1].status = 'red'
    medical_event = RedMedicalEvent.new
    medical_event.occurred_at = statuses[-2].status_set_at
    medical_events.push(medical_event)
  end

  if color == 'absent'
    statuses[-3].status = 'absent'
    statuses[-2].status = 'absent'
    statuses[-1].status = 'abset'
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

single_parents = Array.new(1000) { User.new }
husbands = Array.new(5000) { 
  u = User.new
  u.first_name = Faker::Name.male_first_name
  u
}

wives = husbands.map { |h| 
  u = User.new
  u.last_name = Faker::Name.female_first_name
  u.last_name = h.last_name
  u
}

parents = [single_parents, husbands, wives].flatten

#
# Children
#

single_parents.each do |parent|
  child = User.new
  child.last_name = parent.last_name
  parent.children << child
  child.parents << parent
end

husbands.zip(wives).each do |h, w|
  children = Array.new(2) { User.new }
  children.each { |c| c.parents = [h, w ]}
  h.children = children
  w.children = children
end

children = parents.flat_map(&:children)

#
# Teachers and Staff
#

teachers = Array.new((children.size / 30).round) { User.new }
teachers = [teachers + parents.sample(10)].flatten
staff = Array.new((teachers.size / 3).round) { User.new }

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

soccer_team = Cohort.new(name: 'Soccer Team', category: 'activities')
football_team = Cohort.new(name: 'Football Team', category: 'activities')

freshmen = Cohort.new(name: 'Freshmen', category: 'grade')
sophomore = Cohort.new(name: 'Sophomore', category: 'grade')
junior = Cohort.new(name: 'Junior', category: 'grade')
senior = Cohort.new(name: 'Senior', category: 'grade')

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
