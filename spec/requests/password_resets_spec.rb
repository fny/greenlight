# frozen_string_literal: true
require 'rails_helper'

RSpec.describe '/v1/password-resets', type: :request do
  let(:user) { Fabricate(:user) }

  describe 'POST' do
    it 'generates token and sends link when an email is provided' do
      post_json('/v1/password-resets', body: {
                                        emailOrMobile: user.email,
                                      })
      expect_success_response
      expect(user.password_reset).to be_present
      expect(user.password_reset).to be_token_valid

      expect_work(PasswordResetWorker)

      last_delivery = Mail::TestMailer.deliveries.last
      expect(last_delivery[:subject].to_s).to include('Greenlight Password Reset')
      expect(last_delivery.html_part.to_s).to include(user.password_reset_url)
    end

    it 'generates token and sends link via SMS when a mobile numer is provided' do
      post_json('/v1/password-resets', body: {
                                        emailOrMobile: user.mobile_number,
                                      })
      expect_success_response
      expect(user.password_reset).to be_present
      expect(user.password_reset).to be_token_valid

      expect_work(PasswordResetWorker)

      last_delivery = PlivoSMS.deliveries.last
      expect(last_delivery[:message]).to include('Greenlight Password Reset')
      expect(last_delivery[:message]).to include(user.password_reset_url)
    end
  end

  describe 'POST :token' do
    let(:new_password) { Faker::Alphanumeric.alphanumeric }
    before do
      post_json('/v1/password-resets', body: {
                                        emailOrMobile: user.email,
                                      })
      @token = user.password_reset.token
    end

    it 'resets the password' do
      post_json("/v1/password-resets/#{@token}", body: {
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
      post_json('/v1/password-resets', body: {
        emailOrMobile: user.email,
      })
      @token = user.password_reset.token
    end

    it 'validates the token' do
      get("/v1/password-resets/#{@token}/valid")
      expect_success_response
    end
  end
end
