# frozen_string_literal: true
module PasswordResetController
  extend ActiveSupport::Concern
  include ApplicationHelpers

  included do
    post '/v1/password_reset' do
      email_or_mobile = request_json[:email_or_mobile]
      e_or_m = EmailOrPhone.new(email_or_mobile)
      fail!(:email_or_mobile, :invalid) if e_or_m.invalid?
      user = User.find_by_email_or_mobile(e_or_m)

      fail!(:email_or_mobile, :phone_not_found) if user.nil? && e_or_m.phone?
      fail!(:email_or_mobile, :email_not_found) if user.nil? && e_or_m.email?

      user.generate_password_token!
      set_status_created
    end

    get '/v1/password_reset/:token/valid' do |token|
      if PasswordReset.token_valid?(token)
        success_response
      else
        raise UnauthorizedError
      end
    end

    post '/v1/password_reset/:token' do |token|
      PasswordReset.reset_password!(token, request_json[:password])
      set_status_updated
    end
  end
end
