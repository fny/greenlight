require 'rails_helper'

RSpec.describe LocationAccount, type: :model do
  fixtures :all

  describe '#parents' do
    it "returns the child's parents" do
      bart = users(:bart)
      parents = bart.location_accounts.where(location: locations(:springfield_elementary)).parents
      expect(parents).to eq(parents)
    end
  end
end
