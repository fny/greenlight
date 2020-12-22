# frozen_string_literal: true
class LocationAccountSerializer < ApplicationSerializer
  attribute :external_id
  attribute :role
  attribute :permission_level
  attribute :location_id

  # has_one :user
  has_one :location
end
