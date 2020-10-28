class ApplicationController < Sinatra::Base
  include ApplicationHelpers
  include RootController
  include DebugController
  include LocationsUsersController
  include SessionsController
  include UsersController
  include CurrentUserController
  if Rails.env.development?
    include DevelopmentController
  end

  set :show_exceptions, false

  before do
    content_type 'application/json'

    @session = Session.new(cookies)
    Time.zone = current_user.time_zone
    I18n.locale = current_user.locale

    request.env['exception_notifier.exception_data'] = {
      current_user: current_user
    }
  end

  before '/v1/*' do
    ensure_authenticated! unless %w[sessions magic-sign-in current-user].include?(params['splat'].first)
  end

  after do
    cookies.write(response.headers)
  end

  error do
    e = env['sinatra.error']
    Rails.logger.error(e.message)
    Rails.logger.error(e.backtrace.join("\n"))
    raise e unless Rails.env.production?

    JSONAPI::Errors.serialize(
      JSONAPI::Errors::Wrapper.new(title: e.class.to_s, detail: e.message, backtrace: e.backtrace.join("\n"))
    ).to_json
  end

  error JSONAPI::Error do
    e = env['sinatra.error']
    response.status = e.status
    e.to_json
  end

  error NotFoundError do
    response.status = 404 # Not Found
    JSONAPI::Errors.serialize(JSONAPI::Errors::NotFound.new).to_json
  end

  error UnauthorizedError do
    response.status = 401 # Unauthorized
    JSONAPI::Errors.serialize(JSONAPI::Errors::Unauthorized.new).to_json
  end

  error ForbiddenError do
    response.status = 403 # Forbidden
    JSONAPI::Errors.serialize(JSONAPI::Errors::Forbidden.new).to_json
  end
end
