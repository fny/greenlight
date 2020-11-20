# frozen_string_literal: true
class APIController < ActionController::API
  include ActionController::Cookies
  include Sinatrify
  include APIHelpers
  include RootController
  include DebugController
  include LocationsController
  include SessionsController
  include PasswordResetsController
  include UsersController
  include CurrentUserController

  before_action do
    @session = Session.new(cookies)
    Time.zone = current_user.time_zone
    I18n.locale = current_user.locale

    request.env['exception_notifier.exception_data'] = {
      current_user: current_user
    }
  end

  before_action do
    split_path = request.path.split('/')
    # Remember! split_path[0] == "" since paths start with a /

    next if %w[ping sessions magic-sign-in password-resets].include?(split_path[2])
    next if request.path == '/v1/users/create-and-sign-in'
    next if request.path.starts_with?('/v1/locations') && split_path.length == 4
    ensure_authenticated!
  end

  rescue_from NotFoundError do
    response.status = 404 # Not Found
    render json: JSONAPI::Errors.serialize(JSONAPI::Errors::NotFound.new)
  end

  rescue_from UnauthorizedError do
    response.status = 401 # Unauthorized
    render json: JSONAPI::Errors.serialize(JSONAPI::Errors::Unauthorized.new)
  end

  rescue_from ForbiddenError do
    response.status = 403 # Forbidden
    render json: JSONAPI::Errors.serialize(JSONAPI::Errors::Forbidden.new)
  end
end
