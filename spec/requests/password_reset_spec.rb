# frozen_string_literal: true
require 'rails_helper'

RSpec.describe '/v1/password-reset', type: :request do
  let(:user) { Fabricate(:user) }

  describe 'POST' do
    it 'generates token with email' do
      post_json('/v1/password-reset', body: {
                                        emailOrMobile: user.email,
                                      })
      expect_success_response
      expect(user.password_reset).to be_present
      expect(user.password_reset).to be_token_valid
    end

    it 'generates token with mobile' do
      post_json('/v1/password-reset', body: {
                                        emailOrMobile: user.mobile_number,
                                      })
      expect_success_response
      expect(user.password_reset).to be_present
      expect(user.password_reset).to be_token_valid
    end
  end

  describe 'POST :token' do
    let(:new_password) { Faker::Alphanumeric.alphanumeric }
    before do
      post_json('/v1/password-reset', body: {
                                        emailOrMobile: user.email,
                                      })
      @token = user.password_reset.token
    end

    it 'resets the password' do
      post_json("/v1/password-reset/#{@token}", body: {
        password: new_password
      })
      expect_success_response
      
      post_json('/v1/sessions', body: {
        emailOrMobile: user.email,
        password: new_password
      })
      expect_success_response
    end
  end

  describe 'GET :token/valid' do
    before do
      post_json('/v1/password-reset', body: {
        emailOrMobile: user.email,
      })
      @token = user.password_reset.token
    end

    it 'validates the token' do
      get("/v1/password-reset/#{@token}/valid")
      expect_success_response
    end
  end
end
