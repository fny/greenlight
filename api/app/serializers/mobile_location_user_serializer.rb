# This is the serialzier to use for the mobile app.
# It should load *everything* that is required.
class MobileLocationUserSerializer < ApplicationSerializer
  ADMIN_INCLUDES = [
    :location_accounts,
    :last_greenlight_status
  ]

  set_type :user

  attribute :first_name
  attribute :last_name
  # attribute :email
  # attribute :password_set_at
  # attribute :email_confirmation_sent_at
  # attribute :email_confirmed_at
  # attribute :email_unconfirmed

  # attribute :mobile_number
  # attribute :mobile_carrier
  # attribute :mobile_number_unconfirmed
  # attribute :mobile_number_confirmation_sent_at
  # attribute :mobile_number_confirmed_at
  # attribute :is_sms_gateway_emailable

  # attribute :accepted_terms_at
  # attribute :completed_invite_at

  attribute :locale
  attribute :zip_code
  attribute :birth_date
  attribute :physician_name
  attribute :physician_phone_number

  has_one :last_greenlight_status, serializer: GreenlightStatusSerializer, record_type: 'greenlightStatus'

  # has_many :children, serializer: MobileUserSerializer, record_type: 'user'

  has_many :location_accounts

end
