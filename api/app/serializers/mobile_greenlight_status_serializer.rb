# frozen_string_literal: true
class MobileGreenlightStatusSerializer < ApplicationSerializer
  set_type :greenlight_status
  attribute :status
  attribute :reason
  attribute :submission_date
  attribute :expiration_date
  attribute :follow_up_date

  attribute :created_at
  attribute :updated_at
  attribute :deleted_at

  has_one :user
end
