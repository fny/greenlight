require 'rails_helper'

RSpec.describe Authentication, type: :model do
  let(:password) { 'SUPER_SECRET_PASSWORD' }
  let(:user) { Fabricate(:user, password: password) }

  describe 'validations' do
    it { should validate_presence_of(:email_or_mobile) }
    it { should validate_presence_of(:password) }
    it { should validate_presence_of(:ip_address) }
  end

  it "results with a user with a valid mobile number and password" do
    auth = Authentication.new(
      email_or_mobile: user.mobile_number,
      password: password,
      ip_address: Faker::Internet.ip_v4_address
    )
    expect(auth.run).to eq(true)
    expect(auth.result).to eq(user)
  end

  it "results with a user with a valid email and password" do
    auth = Authentication.new(
      email_or_mobile: user.email,
      password: password,
      ip_address: Faker::Internet.ip_v4_address
    )
    expect(auth.run).to eq(true)
    expect(auth.result).to eq(user)
  end

  it "fails if a password was never set" do
    user.update_column(:password_digest, nil)
    auth = Authentication.new(
      email_or_mobile: user.email,
      password: password,
      ip_address: Faker::Internet.ip_v4_address
    )
    expect(auth.run).to eq(false)
    expect(auth.errors.added?(:password, :never_set_password)).to eq(true)
  end

  it "fails if no valid email or mobile number is provided" do
    auth = Authentication.new(
      email_or_mobile: 'thisisnonsense',
      password: password,
      ip_address: Faker::Internet.ip_v4_address
    )
    expect(auth.run).to eq(false)
    expect(auth.errors.added?(:email_or_mobile, :invalid)).to eq(true)
  end

  it "fails if the email does not exist" do
    auth = Authentication.new(
      email_or_mobile: 'idontexist@gmail.com',
      password: password,
      ip_address: Faker::Internet.ip_v4_address
    )
    expect(auth.run).to eq(false)
    expect(auth.errors.added?(:email_or_mobile, :email_not_found)).to eq(true)
  end

  it "fails if the mobile number does not exist" do
    auth = Authentication.new(
      email_or_mobile: '407-444-8135',
      password: password,
      ip_address: Faker::Internet.ip_v4_address
    )
    expect(auth.run).to eq(false)
    expect(auth.errors.added?(:email_or_mobile, :phone_not_found)).to eq(true)
  end

  it "fails if the password is wrong" do
    auth = Authentication.new(
      email_or_mobile: user.email,
      password: 'this_is_invalid',
      ip_address: Faker::Internet.ip_v4_address
    )
    expect(auth.run).to eq(false)
    expect(auth.errors.added?(:password, :invalid)).to eq(true)
  end
end
