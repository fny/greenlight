# frozen_string_literal: true
class CohortSerializer < ApplicationSerializer
  attributes :name, :category, :code
  has_one :location
end
