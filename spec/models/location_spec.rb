require 'rails_helper'

RSpec.describe Location, type: :model do
  fixtures :all

  let(:springfield) {
    locations(:springfield_elementary)
  }

  describe '#students' do
    it 'returns a list of users with student location accounts' do
      names = springfield.students.map(&:first_name)
      expect(names).to include('Bart', 'Lisa', 'Todd', 'Rodd')
      expect(names).not_to include('Edna', 'Ned', 'Seymour', 'Homer', 'Marge')
    end
  end

  describe '#parents' do
    it 'returns a list of users with student location accounts' do
      names = springfield.parents.map(&:first_name)
      expect(names).to include('Ned', 'Homer', 'Marge')
      expect(names).not_to include('Bart', 'Lisa', 'Todd', 'Rodd', 'Edna', 'Seymour')
    end
  end

  describe '#staff' do
    it 'returns a list of users with student location accounts' do
      names = springfield.staff.map(&:first_name)
      expect(names).to include('Seymour')
      expect(names).not_to include('Bart', 'Lisa', 'Todd', 'Rodd', 'Edna', 'Homer', 'Marge')
    end
  end

  describe '#sync_cohorts!' do
    it 'sync the cohorts with the ones in the schema' do
      greenlight = Fabricate.build(:greenlight_academy)
      greenlight.save
      expect(greenlight.cohorts.map(&:code)).to contain_exactly('team:ed', 'team:business', 'timezone:est', 'timezone:cst', 'timezone:mst', 'timezone:pst', 'education:medstudent', 'education:professional', 'education:undergrad')
    end
  end

  describe 'registration codes' do
    it 'will be set when a location is created' do
      location = Fabricate(:location)
      expect(location.registration_code).not_to eq(nil)
      expect(location.student_registration_code).not_to eq(nil)
    end
  end
end
