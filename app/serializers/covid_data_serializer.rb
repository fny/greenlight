# frozen_string_literal: true

class CovidDataSerializer < ApplicationSerializer
  attributes :county, :state, :fips, :cases, :deaths
end
