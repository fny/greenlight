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
  attribute :student_registration_code
  attribute :employee_count

  SWAGGER_SCHEMA = SwaggerSchemaBuilder.build do
    data {
      id :string
      type :string, enum: [:location]
      attributes {
        name :string
        category :string
        permalink :string
        hidden :boolean
        phone_number :string, nullable: true
        email :string, nullable: true
        website :string, nullable: true
        zip_code :string
        reminders_enabled :boolean
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
        registration_code :string
        student_registration_code :string
        employee_count :string
      }
    }
  end
end
