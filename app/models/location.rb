# frozen_string_literal: true

class Location < ApplicationRecord
  self.permitted_params = %i[
    name category permalink phone_number email website zip_code hidden
    daily_reminder_time employee_count
    remind_mon remind_tue remind_wed remind_thu remind_fri remind_sat remind_sun
  ]

  belongs_to :created_by, class_name: 'User', optional: true
  has_many :location_accounts
  has_many :cohorts
  has_many :users, through: :location_accounts

  # has_many :students,
  # has_many :teachers
  # has_many :staff

  validates :phone_number, phone: { countries: :us }, allow_nil: true
  before_create :set_registration_code

  def self.find_by_id_or_permalink(id)
    find_by(id: id) || find_by(permalink: id)
  end

  def self.find_by_id_or_permalink!(id)
    find_by_id_or_permalink(id) ||
      raise(ActiveRecord::RecordNotFound, "Location could not be found by #{id}")
  end

  def phone_number=(value)
    return if value.blank?

    parsed = Phonelib.parse(value, 'US').full_e164
    parsed = nil if parsed.blank?
    self[:phone_number] = parsed
  end

  def users_to_invite
    users_to_notify.filter { |u| u.completed_welcome_at.blank? }
  end

  # We send reminders to users who have finished the welcome sequence
  def users_to_remind
    users_to_notify.filter { |u| u.completed_welcome_at.present? && !u.submitted_for_today? }
  end

  def remind_users
    users_to_remind.each { |u| ReminderWorker.perform_async(u.id) }
    true
  end

  def invite_users
    users_to_invite.each { |u| InviteWorker.perform_async(u.id) }
    true
  end

  def remind_users_now
    users_to_remind.each { |u| ReminderWorker.new.perform(u.id) }
    true
  end

  def invite_users_now
    users_to_invite.each { |u| InviteWorker.new.perform(u.id) }
    true
  end

  def registration_code=(code)
    self[:registration_code] = code
    self.registration_code_downcase = code.downcase
  end

  # Any users that should recieve a notification
  def users_to_notify
    location = Location.includes(
      :location_accounts,
      location_accounts: { user: :parents },
    ).find(self.id)

    users_to_notify = Set.new

    location.location_accounts.each do |la|
      if la.role.student?
        la.user.parents.each do |p|
          users_to_notify.add(p)
        end
      else
        users_to_notify.add(la.user)
      end
    end
    users_to_notify
  end

  def generate_registration_code
    thing = RandomWords.things.capitalize
    color = RandomWords.colors.capitalize
    number = (SecureRandom.random_number(9e1) + 1e1).to_i
    # letter = (('a'..'z').to_a - ['l']).sample
    "#{color}#{thing}#{number}"
  end

  def refresh_registration_code!
    code = generate_registration_code
    update_columns({ # rubocop:disable Rails/SkipsModelValidations
      registration_code: code,
      registration_code_downcase: code.downcase
    })
  end

  private

  def set_registration_code
    self.registration_code = generate_registration_code
  end
end

# == Schema Information
#
# Table name: locations
#
#  id                         :bigint           not null, primary key
#  name                       :text             not null
#  category                   :text             not null
#  permalink                  :text             not null
#  phone_number               :text
#  email                      :text
#  website                    :text
#  zip_code                   :text
#  hidden                     :boolean          default(TRUE), not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  daily_reminder_time        :integer          default(7), not null
#  remind_mon                 :boolean          default(TRUE), not null
#  remind_tue                 :boolean          default(TRUE), not null
#  remind_wed                 :boolean          default(TRUE), not null
#  remind_thu                 :boolean          default(TRUE), not null
#  remind_fri                 :boolean          default(TRUE), not null
#  remind_sat                 :boolean          default(TRUE), not null
#  remind_sun                 :boolean          default(TRUE), not null
#  employee_count             :integer
#  approved_at                :datetime
#  created_by_id              :bigint
#  registration_code          :string
#  registration_code_downcase :string
#
# Indexes
#
#  index_locations_on_created_by_id  (created_by_id)
#  index_locations_on_permalink      (permalink) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#
