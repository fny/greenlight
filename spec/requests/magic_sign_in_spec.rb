# frozen_string_literal: true
require 'rails_helper'

RSpec.describe "/v1/magic-sign-in", type: :request do
  describe '#POST' do
    let(:user) { Fabricate(:user) }

    it "sends a magic sign in email when an email is provided" do
      post_json('/v1/magic-sign-in', body: {
        emailOrMobile: user.email,
        rememberMe: false
      })
      expect_success_response
      expect_work(MagicSignInWorker)

      last_delivery = Mail::TestMailer.deliveries.last
      expect(last_delivery[:subject].to_s).to include('Greenlight Magic Sign In')
    end

    it "sends a magic sign in email in the users language" do
      user.update(locale: 'es')
      post_json('/v1/magic-sign-in', body: {
        emailOrMobile: user.email,
        rememberMe: false
      })
      expect_work(MagicSignInWorker)
      last_delivery = Mail::TestMailer.deliveries.last
      expect_success_response
      expect(last_delivery[:subject].to_s).to include('Greenlight Iniciar Sesión con Magia')
    end

    it "sends a magic sign in text when a mobile number is provided" do
      post_json('/v1/magic-sign-in', body: {
        emailOrMobile: user.mobile_number,
        rememberMe: false
      })
      expect_success_response

      expect_work(MagicSignInWorker)

      last_delivery = PlivoSMS.deliveries.last
      expect(last_delivery[:message]).to include('Greenlight Magic Sign In')
  end

    # the length of the usual message exceeds the SMS cut-off limit (86 > 70)
    it "sends a magic sign in text in the users language (es)" do
      user.update(locale: 'es')
      post_json('/v1/magic-sign-in', body: {
        emailOrMobile: user.mobile_number,
        rememberMe: false
      })
      expect_work(MagicSignInWorker)
      last_delivery = PlivoSMS.deliveries.last
      expect_success_response
      expect(last_delivery[:message]).to include('Greenlight iniciar sesion con magia')
    end
  end
end
