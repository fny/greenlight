require 'rails_helper'

RSpec.describe "/v1/magic-sign-in", type: :request do
  describe '#POST' do
    let(:user) { Fabricate(:user) }

    it "sends a magic sign in email when an email is provided" do
      post_json('/v1/magic-sign-in', body: {
        emailOrMobile: user.email,
        rememberMe: false
      })
      expect(response_json[:success]).to eq(true)
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
      expect(response_json[:success]).to eq(true)
      expect(last_delivery[:subject].to_s).to include('Greenlight Iniciar Sesión con Magia')
    end

    it "sends a magic sign in text when a mobile number is provided" do
      post_json('/v1/magic-sign-in', body: {
        emailOrMobile: user.mobile_number,
        rememberMe: false
      })
      expect(response_json[:success]).to eq(true)

      expect_work(MagicSignInWorker)

      last_delivery = PlivoSMS.deliveries.last
      expect(last_delivery[:message]).to include('Greenlight Magic Sign In')
    end

    it "sends a magic sign in text in the users language" do
      user.update(locale: 'es')
      post_json('/v1/magic-sign-in', body: {
        emailOrMobile: user.mobile_number,
        rememberMe: false
      })
      expect_work(MagicSignInWorker)
      last_delivery = PlivoSMS.deliveries.last
      expect(response_json[:success]).to eq(true)
      expect(last_delivery[:message]).to include('Greenlight Iniciar Sesión con Magia')
    end
  end
end
