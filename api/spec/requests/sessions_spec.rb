require 'rails_helper'

RSpec.describe '/v1/sessions', type: :request do
  let(:user) { Fabricate(:user) }

  describe 'POST' do
    it 'signs in with email' do
      post_json('/v1/sessions', body: {
                                  emailOrMobile: user.email,
                                  password: user.password,
                                  rememberMe: false,
                                })
      expect_success_json
      expect(response.cookies[Session::COOKIE_NAME]).not_to eq(nil)
      get_json('/v1/current-user')
      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
    end

    it 'signs in with mobile' do
      expect(User.find_by(mobile_number: user.mobile_number).mobile_number).to eq(user.mobile_number)
      expect(User.find_by(email: user.email).email).to eq(user.email)

      post_json('/v1/sessions', body: {
                                  emailOrMobile: user.mobile_number,
                                  password: user.password,
                                  rememberMe: false,
                                })
      expect_success_json
      expect(response.cookies[Session::COOKIE_NAME]).not_to eq(nil)
      get_json('/v1/current-user')
      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
    end

    it 'does not change the users auth token to allow for sessions to remain across devices' do
      token_before = user.auth_token
      token_set_at_before = user.auth_token_set_at
      sign_in(user)
      expect(user.auth_token).to eq(token_before)
      expect(user.auth_token_set_at).to eq(token_set_at_before)
    end

    it 'logs a sign in' do
      count_before = user.sign_in_count
      sign_in(user)
      user.reload
      expect(user.sign_in_count).to eq(count_before + 1)
    end

    it 'logs a sign in' do
      count_before = user.sign_in_count
      sign_in(user)
      user.reload
      expect(user.sign_in_count).to eq(count_before + 1)
    end

    it 'can be remembered for up to a year' do
      sign_in(user, remember_me: true)
      get '/v1/current-user'
      expect(response.status).to eq(200)
      travel_to 360.days.from_now
      get '/v1/current-user'
      expect(response.status).to eq(200)
      travel_to 10.days.from_now
      get '/v1/current-user'
      expect(response.status).to eq(401)
      travel_back
    end
  end

  describe 'DELETE' do
    it 'signs out' do
      token_before = user.auth_token
      sign_in(user)
      delete_json('/v1/sessions')
      user.reload
      expect(user.auth_token).not_to eq(token_before)
    end
  end


end
