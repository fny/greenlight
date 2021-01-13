# frozen_string_literal: true
class LocationSerializer < ApplicationSerializer
  attribute :name
  attribute :category
  attribute :permalink
  attribute :hidden
  attribute :phone_number
  attribute :email
  attribute :website
  attribute :zip_code
  attribute :reminders_enabled
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
  attribute :registration_code
  attribute :employee_count
  attribute :full_cohort_schema
end
