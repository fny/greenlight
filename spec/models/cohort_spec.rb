# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Cohort, type: :model do
  let(:location) { Fabricate(:location, cohort_schema: { 'Home Room' => ['A', 'B'] })}
  describe '#cohort_in_schema' do
    it 'is valid when the schema contains the cohort info' do
      expect(Cohort.new(
        location: location,
        category: 'Home Room',
        name: 'A'
      ).valid?).to eq(true)
    end

    it 'is invalid when the schema does not contain the cohort info' do
      expect(Cohort.new(
        location: location,
        category: 'Bus Route',
        name: 'A'
      ).valid?).to eq(false)
    end
  end
end
