# frozen_string_literal: true
require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { Fabricate(:user) }

  describe 'relationships' do
    it 'has parent/child relationships' do
      parent = Fabricate(:user)
      child = Fabricate(:user)
      parent.children << child

      parent.save

      expect(User.find(parent.id).children.include?(child)).to eq(true)
      expect(User.find(child.id).parents.include?(parent)).to eq(true)
    end

    it 'has todays greenlight status' do
      gl_status = Fabricate.build(:greenlight_status)
      gl_status.user = user
      gl_status.created_by = user
      gl_status.save
      status = GreenlightStatus.submitted_for_today.where(user: user).first
      expect(status).not_to eq(nil)
      expect(status.status).to eq(gl_status.status)
      expect(user.last_greenlight_status.status).to eq(gl_status.status)
    end
  end

  describe '.permitted_params' do
    it 'is a list of permitted params' do
      expect(User.permitted_params).to include(:email)
    end
  end

  describe '.restrict_params' do
    it 'restricts the attributes to those that are permitted for symbols'  do
      permitted = User.restrict_params({ email: 'a', password: 'b', created_at: 'c' })
      expect(permitted).to eq({ 'email' => 'a', 'password' => 'b' })
    end

    it 'restricts the attributes to those that are permitted for strings' do
      permitted = User.restrict_params({ 'email' => 'a', 'password' => 'b', 'created_at' => 'c' })
      expect(permitted).to eq({ 'email' => 'a', 'password' => 'b' })
    end
  end

  describe '#admin_of?' do
    let(:location1) { Fabricate(:location) }
    let(:location2) { Fabricate(:location) }
    let(:admin1) do
      u = Fabricate(:user)
      u.location_accounts.create(user: u, location: location1, role: 'teacher', permission_level: LocationAccount::ADMIN)
      u
    end
    let(:user2) do
      u = Fabricate(:user)
      u.location_accounts.create(user: u, location: location1, role: 'student', permission_level: LocationAccount::NONE)
      u
    end

    [
      ['admin', 'same location', true],
      ['admin', 'different location', false],
      ['not admin', 'same location', false],
      ['not admin', 'different location', false],
    ].each do |admin_status, location_status, result|
      it "is #{result} given #{admin_status} role and the other user in #{location_status}" do
        admin = admin_status == 'admin' ? admin1 : user2
        u = location_status.include?('same') ? user2 : user
        expect(admin.admin_of?(u)).to eq(result)
      end
    end
  end
end
