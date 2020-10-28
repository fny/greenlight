# frozen_string_literal: true
class LocationSerializer < ApplicationSerializer
  attributes :name, :category, :permalink, :hidden, :phone_number, :email, :website, :zip_code
end
