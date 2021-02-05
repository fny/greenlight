# frozen_string_literal: true
module SessionsController
  extend ActiveSupport::Concern

  included do
    post '/v1/sessions', auth: false do
      authentication = Authentication.new(request_json)
      authentication.ip_address = request.ip
      authentication.run
      if authentication.succeeded?
        sign_in(authentication.result, request.ip, remember_me: request_json[:remember_me])
        success_response_with_token
      else
        error_response(authentication)
      end
    end

    delete '/v1/sessions' do
      @session.destroy
      success_response
    end

    post '/v1/magic-sign-in/:token', auth: false do
      token = params[:token]
      user = User.find_by!(magic_sign_in_token: token)
      sign_in(user, request.ip, remember_me: request_json[:remember_me])
      user.reset_magic_sign_in_token!
      success_response_with_token
    end

    post '/v1/magic-sign-in', auth: false do
      sign_in = MagicSignInRequest.new(request_json)
      sign_in.run
      if sign_in.succeeded?
        success_response
      else
        error_response(sign_in)
      end
    end
  end
end
