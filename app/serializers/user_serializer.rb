# frozen_string_literal: true
class UserSerializer < ApplicationSerializer
  attribute :first_name
  attribute :last_name
  attribute :email
  attribute :mobile_number
  attribute :physician_name
  attribute :physician_phone_number
  attribute :zip_code
  attribute :completed_welcome_at

  has_many :location_accounts
  has_one :last_greenlight_status, serializer: GreenlightStatusSerializer, record_type: 'greenlightStatus'

  # has_many :parents
  # has_many :cohorts
  # has_many :greelight_statuses
  # has_many :medical_events
  # has_many :recent_greelight_statuses
  # has_many :recent_medical_events
end
