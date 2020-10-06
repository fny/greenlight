require 'rails_helper'

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
    gl_status.created_by_user = user
    gl_status.save

    status = GreenlightStatus.submitted_today.where(user: user).first
    expect(status.status).to eq(gl_status.status)
    expect(user.last_greenlight_status.status).to eq(gl_status.status)
    expect(user.todays_greenlight_status.status).to eq(gl_status.status)
  end
end
