# frozen_string_literal: true
module PasswordResetsController
  extend ActiveSupport::Concern

  included do
    post '/v1/password-resets', auth: false do
      reset = PasswordReset.new(
        email_or_mobile: request_json[:email_or_mobile],
        locale: current_locale
      )
      if reset.succeeded?
        success_response
      else
        error_response(reset)
      end
    end

    get '/v1/password-resets/:token/valid', auth: false do
      if PasswordReset.token_valid?(params.fetch(:token))
        success_response
      else
        # TODO: I18n
        simple_error_response('invalid link')
      end
    end

    post '/v1/password-resets/:token', auth: false do
      PasswordReset.reset_password!(params.fetch(:token), request_json[:password])
      success_response
    end
  end
end
