# frozen_string_literal: true
class CohortSerializer < ApplicationSerializer
  attributes :name, :category
  has_one :location
end