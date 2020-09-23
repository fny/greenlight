# This is the serialzier to use for the mobile app.
# It should load *everything* that is required.
class UserMobileSerializer < ApplicationSerializer
  set_type :user

  attribute :first_name
  attribute :last_name
  attribute :email
  # attribute :email_confirmation_sent_at
  # attribute :email_confirmed_at
  # attribute :email_unconfirmed

  attribute :mobile_number
  attribute :mobile_carrier
  # attribute :mobile_number_unconfirmed
  # attribute :mobile_number_confirmation_sent_at
  # attribute :mobile_number_confirmed_at
  # attribute :is_sms_gateway_emailable
  
  attribute :accepted_terms_at
  attribute :completed_welcome_at

  attribute :language
  attribute :zip_code
  attribute :birth_date
  attribute :physician_name
  attribute :physician_phone_number
  
  has_many :children, serializer: UserSerializer, record_type: 'user'
  
  has_many :locations
  has_many :location_accounts

  has_many :recent_medical_events, serializer: MedicalEventSerializer, record_type: 'medicalEvent'
  has_many :recent_greenlight_statuses, serializer: GreenlightStatusSerializer, record_type: 'greenlightStatus'
end