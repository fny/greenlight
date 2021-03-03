# frozen_string_literal: true
require 'rails_helper'

RSpec.describe User, type: :model do
  let(:user) { Fabricate(:user) }
  let(:location) { Fabricate(:location) }
  let(:parent) { Fabricator(:parent_with_two_children) }

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

    it 'has a last greenlight status' do
      expect(user.last_greenlight_status).to eq(nil)

      status1 = GreenlightStatus.new_cleared_status(Time.current, user: user, created_by: user)
      status1.save!
      expect(user.reload.last_greenlight_status).to eq(status1)

      travel_to Time.current + 10.days
      status2 = GreenlightStatus.new_cleared_status(Time.current, user: user, created_by: user)
      status2.save!
      expect(user.reload.last_greenlight_status).to eq(status2)
      travel_back
    end
  end

  describe '.permitted_params' do
    it 'is a list of permitted params' do
      expect(User.permitted_params).to include(:email)
    end
  end

  describe '.restrict_params' do
    it 'restricts the attributes to those that are permitted for symbols'  do
      permitted = User.restrict_params({ email: 'a', 'password' => 'b', created_at: 'c' })
      expect(permitted).to eq({ 'email' => 'a' })
    end

    it 'restricts the attributes to those that are permitted for strings' do
      permitted = User.restrict_params({ 'email' => 'a', 'created_at' => 'c' })
      expect(permitted).to eq({ 'email' => 'a' })
    end

    it 'allows additional params' do
      permitted = User.restrict_params({ email: 'a', password: 'b' }, [:password])
      expect(permitted).to eq({ 'email' => 'a', 'password' => 'b' })
    end
  end

  describe '.email_taken?' do
    it 'returns true when the email is in use' do
      user = Fabricate(:user)
      expect(User.email_taken?(user.email)).to eq(true)
    end

    it 'returns false when the email is not in use' do
      user = Fabricate(:user)
      user.destroy
      expect(User.email_taken?(user.email)).to eq(false)
    end

    it 'returns false when the email is invalid' do
      expect(User.email_taken?('notinuse')).to eq(false)
    end
  end

  describe '.mobile_taken?' do
    it 'returns true when the mobile number is in use' do
      user = Fabricate(:user)
      expect(User.mobile_taken?(user.mobile_number)).to eq(true)
    end

    it 'returns false when the mobile number is not in use' do
      user = Fabricate(:user)
      user.destroy
      expect(User.mobile_taken?(user.mobile_number)).to eq(false)
    end

    it 'returns false when the mobile number is invalid' do
      expect(User.mobile_taken?('5553334444')).to eq(false)
    end
  end

  describe '.email_or_mobile_taken?' do
    it 'returns true when the mobile number is in use' do
      user = Fabricate(:user)
      expect(User.email_or_mobile_taken?(user.mobile_number)).to eq(true)
    end

    it 'returns true when the mobile number is in use' do
      user = Fabricate(:user)
      user.destroy
      expect(User.email_or_mobile_taken?(user.mobile_number)).to eq(false)
    end

    it 'returns true when the email is in use' do
      user = Fabricate(:user)
      expect(User.email_or_mobile_taken?(user.email)).to eq(true)
    end

    it 'returns false when the email is not in use' do
      user = Fabricate(:user)
      user.destroy
      expect(User.email_or_mobile_taken?(user.email)).to eq(false)
    end

    it 'returns false when the mobile number is invalid' do
      expect(User.email_or_mobile_taken?('5553334444')).to eq(false)
    end

    it 'returns false when the email is invalid' do
      expect(User.email_or_mobile_taken?('5553334444')).to eq(false)
    end
  end


  describe '#inferred_status' do
    it 'returns an unpersisted unknown status if there is no last status' do
      expect(user.inferred_status.status).to eq(GreenlightStatus::UNKNOWN)
      expect(user.inferred_status.persisted?).to eq(false)
    end

    it 'returns the last submitted status on the same day' do
      status = GreenlightStatus.new_cleared_status(Time.current, user: user, created_by: user)
      status.save!
    end

    it 'returns the unknown if the status has expired' do
      status = GreenlightStatus.new_cleared_status(Time.current, user: user, created_by: user)
      status.save!
      travel_to 2.days.from_now
      expect(user.inferred_status.status).to eq(GreenlightStatus::UNKNOWN)
      expect(user.inferred_status.persisted?).to eq(false)
    end
  end

  describe '#find_by_external_id' do
    it 'returns the user with the apporpriate location account id' do
      user = Fabricate(:user)
      location = Fabricate(:location)
      external_id = 'test'
      user.add_to_location!(location, role: LocationAccount::STUDENT,  permission_level: LocationAccount::NONE, external_id: external_id)

      expect(User.find_by_external_id(external_id)).to eq(user)
    end
  end

  describe '#mobile_number=' do
    it "corrects the formatting of the mobile number" do
      user.mobile_number = '302.332.0728'
      expect(user.mobile_number).to eq('+13023320728')
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

  describe '#destroy' do
    it 'works when the user created a location' do
      user = Fabricate(:user)
      location = Fabricate(:location, created_by: user)
      user.destroy
      expect(User.find_by(id: user.id)).to eq(nil)
      expect(location.reload.created_by).to eq(nil)
    end
  end

  describe '#submits_surveys_for' do
    it 'includes the user when they have a location account' do
      user = Fabricate(:user)
      location = Fabricate(:location)
      Fabricate(:location_account, user: user, location: location)

      expect(user.submits_surveys_for.map(&:id)).to contain_exactly(user.id)
    end

    it 'includes and self the children when they have location accounts' do
      user = Fabricate(:user)
      location = Fabricate(:location)
      Fabricate(:location_account, user: user, location: location)
      child1 = Fabricate(:user)
      Fabricate(:location_account, user: child1, location: location)
      child2 = Fabricate(:user)
      Fabricate(:location_account, user: child2, location: location)
      user.children << [child1, child2]
      expect(user.submits_surveys_for.map(&:id)).to contain_exactly(user.id, child1.id, child2.id)
    end

    it "includes the children only when they only have location accounts" do
      user = Fabricate(:user)
      location = Fabricate(:location)
      child1 = Fabricate(:user)
      Fabricate(:location_account, user: child1, location: location)
      child2 = Fabricate(:user)
      Fabricate(:location_account, user: child2, location: location)
      user.children << [child1, child2]
      expect(user.submits_surveys_for.map(&:id)).to contain_exactly(child1.id, child2.id)
    end
  end

  describe '#needs_to_submit_surveys_for'  do
    it "includes the users who haven't submitted surveys for today" do
      user = Fabricate(:user)
      location = Fabricate(:location)
      Fabricate(:location_account, user: user, location: location)
      child1 = Fabricate(:user)
      Fabricate(:location_account, user: child1, location: location)
      child2 = Fabricate(:user)
      Fabricate(:location_account, user: child2, location: location)
      user.children << [child1, child2]
      expect(user.needs_to_submit_surveys_for.map(&:id)).to contain_exactly(user.id, child1.id, child2.id)

      status = GreenlightStrategyNorthCarolina.new([], []).status
      status.user = user
      status.save!

      expect(user.needs_to_submit_surveys_for.map(&:id)).to contain_exactly(child1.id, child2.id)

      status = GreenlightStrategyNorthCarolina.new([], []).status
      status.user = child2
      status.save!

      expect(user.needs_to_submit_surveys_for.map(&:id)).to contain_exactly(child1.id)
    end
  end

  describe '#purge!' do
    let(:locations) { Fabricate.times(Faker::Number.between(from: 2, to: 4), :location) }
    let(:cohorts) { Fabricate.times(Faker::Number.between(from:2, to: 4), :cohort, location: locations.first) }
    let(:parents) { Fabricate.times(2, :user) }
    let(:children) { Fabricate.times(3, :user) }

    before do
      locations.each { |l| user.add_to_location!(location, role: 'teacher', permission_level: LocationAccount::ADMIN) }
      user.cohorts = cohorts
      user.parents = parents
      user.children = children
      user.save

      Array(1..Faker::Number.between(from:2, to: 10)).each do |day|
        status = GreenlightStatus.new_cleared_status(Time.current - day.days, user: user, created_by: user)
        status.save!

        Fabricate(:yellow_medical_event, greenlight_status: status, user: user, created_by: user)
      end
    end

    subject { user.purge! }
    it 'deletes itself and all associations and belongings' do
      expect(User.count).to eq(6)
      subject

      expect(LocationAccount.count).to be_zero
      expect(ParentChild.count).to be_zero
      expect(CohortUser.count).to be_zero
      expect(MedicalEvent.count).to be_zero
      expect(GreenlightStatus.count).to be_zero
      expect(User.count).to eq(5)
    end

    it 'calls #archive! before deleting the records' do
      expect(user).to receive(:archive!)

      subject
    end

    it 'purges children if flag is set' do
      children.each { |child| expect(child).to receive(:purge!) }

      user.purge!(cascade: true)
    end
  end
end
