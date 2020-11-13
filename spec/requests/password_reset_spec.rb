# frozen_string_literal: true
require 'rails_helper'

RSpec.describe '/v1/password-reset', type: :request do
  let(:user) { Fabricate(:user) }

  describe 'POST' do
    it 'generates token with email' do
      post_json('/v1/password-reset', body: {
                                        emailOrMobile: user.email
                                      })
      expect_success_response
      expect(user.password_reset).to be_present
      expect(user.password_reset).to be_token_valid
    end
  end
end
