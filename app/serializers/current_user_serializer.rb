# frozen_string_literal: true

# This is the serialzier to use for the mobile app.
# It should load *everything* that is required.
class CurrentUserSerializer < ApplicationSerializer
  INCLUDES = [
    :location_accounts,
    :'location_accounts.location',
    :last_greenlight_status,
    :children,
    :'children.location_accounts',
    :'children.location_accounts.location',
    :'children.last_greenlight_status',
    :settings
  ].freeze

  set_type :current_user

  attribute :first_name
  attribute :last_name
  attribute :email
  # attribute :password_set_at
  # attribute :email_confirmation_sent_at
  # attribute :email_confirmed_at
  # attribute :email_unconfirmed

  attribute :mobile_number
  # attribute :mobile_carrier
  # attribute :mobile_number_unconfirmed
  # attribute :mobile_number_confirmation_sent_at
  # attribute :mobile_number_confirmed_at
  # attribute :is_sms_gateway_emailable

  attribute :completed_welcome_at

  attribute :locale
  attribute :zip_code
  attribute :physician_name
  attribute :physician_phone_number

  has_one :last_greenlight_status, serializer: GreenlightStatusSerializer, record_type: :greenlightStatus
  has_one :settings, serializer: UserSettingsSerializer, record_type: :userSettings
  has_many :children, serializer: UserSerializer, record_type: :user
  has_many :location_accounts

  SWAGGER_SCHEMA = SwaggerSchemaBuilder.build do
    data {
      id :string
      type :string, enum: [:currentUser]
      attributes {
        firstName :string
        lastName :string
        email :string, nullable: true
        mobileNumber :string, nullable: true
        mobileCarrier :string, nullable: true
        completedWelcomeAt :string, nullable: true
        locale :string, enum: %i[en es]
        zipCode :string, nullable: true
        physicianName :string, nullable: true
        physicianPhoneNumber :string, nullable: true
        createdAt :string
        updatedAt :string
      }
    }

    has_one :lastGreenlightStatus, :greenlightStatus
    has_one :settings, :userSettings
    has_many :children, :user
    has_many :locationAccounts, :locationAccount

    included LocationSerializer::SWAGGER_SCHEMA
    included GreenlightStatusSerializer::SWAGGER_SCHEMA
    included UserSettingsSerializer::SWAGGER_SCHEMA
    included UserSerializer::SWAGGER_SCHEMA
    included LocationAccountSerializer::SWAGGER_SCHEMA
  end
end
