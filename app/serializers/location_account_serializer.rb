# frozen_string_literal: true
class LocationAccountSerializer < ApplicationSerializer
  attribute :external_id
  attribute :role
  attribute :permission_level
  attribute :location_id

  # has_one :user
  has_one :location

  SWAGGER_SCHEMA = SwaggerSchemaBuilder.build do
    data {
      id :string
      type :string, enum: [:locationAccount]
      attributes {
        external_id :string
        role :string, enum: LocationAccount::ROLES
        permission_level :string, enum: LocationAccount::PERMISSION_LEVELS
        location_id :string
      }
    }
    # has_one :location, :location
    # included LocationSerializer::SWAGGER_SCHEMA
  end
end
