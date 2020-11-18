# frozen_string_literal: true

class UserSettingsSerializer < ApplicationSerializer
  set_type :user_settings
  attribute :override_location_reminders
  attribute :daily_reminder_type
  attribute :daily_reminder_time
  attribute :remind_mon
  attribute :remind_tue
  attribute :remind_wed
  attribute :remind_thu
  attribute :remind_fri
  attribute :remind_sat
  attribute :remind_sun
  attribute :created_at
  attribute :updated_at
end
