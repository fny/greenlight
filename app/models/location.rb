# frozen_string_literal: true
class Location < ApplicationRecord
  has_many :location_accounts
  has_many :cohorts
  has_many :users, through: :location_accounts

  # has_many :students,
  # has_many :teachers
  # has_many :staff

  validates :phone_number, phone: { countries: :us }, allow_nil: true

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

  def users_to_remind
    users_to_notify.filter { |u| !u.completed_welcome_at.blank? && u.submitted_for_today? }
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

  def users_to_invite
    users_to_notify.filter { |u| u.completed_welcome_at.blank? }
  end

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
end

# == Schema Information
#
# Table name: locations
#
#  id           :bigint           not null, primary key
#  name         :text             not null
#  category     :text             not null
#  permalink    :text             not null
#  phone_number :text
#  email        :text
#  website      :text
#  zip_code     :text
#  hidden       :boolean          default(TRUE), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_locations_on_permalink  (permalink) UNIQUE
#