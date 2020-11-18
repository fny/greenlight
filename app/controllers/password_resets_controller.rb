# frozen_string_literal: true
module PasswordResetsController
  extend ActiveSupport::Concern

  included do
    post '/v1/password-resets' do
      email_or_mobile = request_json[:email_or_mobile]
      e_or_m = EmailOrPhone.new(email_or_mobile)
      fail!(:email_or_mobile, :invalid) if e_or_m.invalid?
      user = User.find_by_email_or_mobile(e_or_m)

      fail!(:email_or_mobile, :phone_not_found) if user.nil? && e_or_m.phone?
      fail!(:email_or_mobile, :email_not_found) if user.nil? && e_or_m.email?

      user.generate_password_token!

      if e_or_m.email?
        PasswordResetWorker.perform_async(user.id, :email)
      else
        PasswordResetWorker.perform_async(user.id, :phone)
      end

      success_response
    end

    get '/v1/password-resets/:token/valid' do
      if PasswordReset.token_valid?(params.fetch(:token))
        success_response
      else
        raise UnauthorizedError
      end
    end

    post '/v1/password-resets/:token' do
      PasswordReset.reset_password!(params.fetch(:token), request_json[:password])
      success_response
    end
  end
end
