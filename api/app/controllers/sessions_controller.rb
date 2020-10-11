module SessionsController
  extend ActiveSupport::Concern
  include ApplicationHelpers

  included do
    post '/v1/sessions' do
      authentication = Authentication.new(request_json)
      authentication.ip_address = request.ip
      authentication.run
      if authentication.succeeded?
        @session = Session.from_sign_in(authentication.result, remember_me: request_json[:remember_me])
        @session.to_json
      else
        error_response(authentication)
      end
    end

    delete '/v1/sessions' do
      if current_user
        current_user.reset_auth_token!
      end
      SUCCESS
    end

    post '/v1/magic-sign-in/:token' do |token|
      user = User.find_by!(magic_sign_in_token: token)
      user.save_sign_in!(request.ip)
      @session = Session.from_sign_in(user, remember_me: request_json[:remember_me])
      @session.to_json
    end

    post '/v1/magic-sign-in' do
      sign_in = MagicSignInRequest.new(request_json)
      sign_in.run
      if sign_in.succeeded?
        # TODO: What should the response code be here?
        SUCCESS
      else
        error_response(sign_in)
      end
    end
  end
end
