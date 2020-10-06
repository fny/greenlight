class CohortSerializer < ApplicationSerializer
  attributes :name, :category
  has_one :location
end
