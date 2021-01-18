# frozen_string_literal: true
class GreenlightStatusSerializer < ApplicationSerializer
  set_type :greenlight_status
  attribute :status
  attribute :reason
  attribute :submission_date
  attribute :expiration_date
  attribute :follow_up_date

  attribute :created_at
  attribute :updated_at
  # attribute :deleted_at

  has_one :user

  SWAGGER_SCHEMA = SwaggerSchemaBuilder.build do
    data {
      id :string
      type :string, enum: [:greenlightStatus]
      attributes {
        status :string
        reason :string
        submissionDate :string
        expirationDate :string
        followUpDate :string
        createdAt :string
        updatedAt :string
      }
    }
    has_one :user, :user
  end
end
