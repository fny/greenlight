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
end
