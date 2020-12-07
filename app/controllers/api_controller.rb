# frozen_string_literal: true
class APIController < ActionController::API
  include ActionController::Cookies
  include APIHelpers
  include Sinatrify # Include after everything else but before controllers

  include RootController
  include DebugController
  include LocationsController
  include LocationAccountsController
  include SessionsController
  include PasswordResetsController
  include UsersController
  include CurrentUserController
  include MailController

  before_action do
    @session = Session.new(cookies)
    Time.zone = current_user.time_zone
    I18n.locale = current_locale

    request.env['exception_notifier.exception_data'] = {
      current_user: current_user
    }
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
