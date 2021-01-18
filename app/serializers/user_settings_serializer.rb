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

  SWAGGER_SCHEMA = SwaggerSchemaBuilder.build do
    data {
      id :string
      type :string, enum: [:userSettings]
      attributes {
        override_location_reminders :boolean
        daily_reminder_type :string, enum: UserSettings::DAILY_REMINDER_TYPES
        daily_reminder_time :number
        remind_mon :boolean
        remind_tue :boolean
        remind_wed :boolean
        remind_thu :boolean
        remind_fri :boolean
        remind_sat :boolean
        remind_sun :boolean
        created_at :string
        updated_at :string
      }
    }
  end
end
