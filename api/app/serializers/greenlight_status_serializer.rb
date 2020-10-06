class GreenlightStatusSerializer < ApplicationSerializer
  attribute :status

  attribute :status
  attribute :submission_date
  attribute :expiration_date
  attribute :follow_up_date

  attribute :created_at
  attribute :updated_at
  attribute :deleted_at

  has_one :user
end
