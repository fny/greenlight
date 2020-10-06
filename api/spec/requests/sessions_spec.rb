require 'rails_helper'

RSpec.describe "Session routes", type: :request do
  let(:user) { Fabricate(:user) }
  it "signs in with email" do
    post_json('/v1/sessions', body: {
      emailOrMobile: user.email,
      password: user.password,
      rememberMe: false
    })
    expect(response_json).to have_key(:token)
  end

  it "signs in with mobile" do
    expect(User.find_by(mobile_number: user.mobile_number).mobile_number).to eq(user.mobile_number)
    expect(User.find_by(email: user.email).email).to eq(user.email)

    post_json('/v1/sessions', body: {
      emailOrMobile: user.mobile_number,
      password: user.password,
      rememberMe: false
    })
    expect(response_json).to have_key(:token)
  end

  it "signs out" do
    original_token = user.auth_token
    delete_json('/v1/sessions', user: user)
    user.reload
    expect(user.auth_token).not_to eq(original_token)
  end
end
