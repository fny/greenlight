require "rails_helper"

RSpec.describe User, type: :model do
  let(:user) { Fabricate(:user) }

  it "has parent/child relationships" do
    parent = Fabricate(:user)
    child = Fabricate(:user)
    parent.children << child

    parent.save

    expect(User.find(parent.id).children.include?(child)).to eq(true)
    expect(User.find(child.id).parents.include?(parent)).to eq(true)
  end

  it "has todays greenlight status" do
    gl_status = Fabricate.build(:greenlight_status)
    gl_status.user = user
    gl_status.created_by = user
    gl_status.save

    status = GreenlightStatus.submitted_for_today.where(user: user).first
    expect(status).not_to eq(nil)
    expect(status.status).to eq(gl_status.status)
    expect(user.last_greenlight_status.status).to eq(gl_status.status)
    expect(user.todays_greenlight_status.status).to eq(gl_status.status)
  end

  describe "#admin_of?" do
    let(:location1) { Fabricate(:location) }
    let(:location2) { Fabricate(:location) }
    let(:admin1) do
      user = Fabricate(:user)
      user.location_accounts.create(user: user, location: location1, role: "teacher", permission_level: LocationAccount::ADMIN)
      user
    end
    let(:user1) do
      user = Fabricate(:user)
      user.location_accounts.create(user: user, location: location1, role: "student", permission_level: LocationAccount::NONE)
      user
    end
    let(:user2) do
      user = Fabricate(:user)
      user.location_accounts.create(user: user, location: location2, role: "student", permission_level: LocationAccount::NONE)
      user
    end

    [
      ["admin", "same location", true],
      ["admin", "different location", false],
      ["not admin", "same location", false],
      ["not admin", "different location", false],
    ].each do |admin_status, location_status, result|
      it "is #{result} given #{admin_status} role and the other user in #{location_status}" do
        admin = admin_status == "admin" ? admin1 : user1
        user = location_status.include?("same") ? user1 : user2
        expect(admin.admin_of?(user)).to eq(result)
      end
    end
  end
end
