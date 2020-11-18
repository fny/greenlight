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
end
