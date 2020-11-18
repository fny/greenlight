# frozen_string_literal: true
module SessionsController
  extend ActiveSupport::Concern

  included do
    post '/v1/sessions' do
      authentication = Authentication.new(request_json)
      authentication.ip_address = request.ip
      authentication.run
      if authentication.succeeded?
        @session = Session.new(cookies, user: authentication.result, remember_me: request_json[:remember_me])
        success_response
      else
        error_response(authentication)
      end
    end

    delete '/v1/sessions' do
      @session.destroy
      success_response
    end

    post '/v1/magic-sign-in/:token' do
      token = params[:token]
      user = User.find_by!(magic_sign_in_token: token)
      user.save_sign_in!(request.ip)
      @session = Session.new(cookies, user: user, remember_me: request_json[:remember_me])
      success_response
    end

    post '/v1/magic-sign-in' do
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
