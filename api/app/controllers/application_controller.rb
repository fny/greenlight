class ApplicationController < Sinatra::Base
  include ApplicationHelpers
  include RootController
  include LocationsUsersController
  include SessionsController
  include UsersController
  include DebugController


  set :show_exceptions, false

  before do
    content_type 'application/json'

    # @cookies = ActionDispatch::Cookies::CookieJar.build(request, request.cookies)

    @session = Session.new(token: request.env['HTTP_AUTHORIZATION'])
    if current_user
      Time.zone = current_user.time_zone
      I18n.locale = current_user.locale
    else
      Time.zone = 'America/New_York'
      I18n.locale = 'en'
    end
  end

  # after do
  #   @cookies.write(response.headers)
  # end

  error do
    e = env['sinatra.error']
    Rails.logger.error(e.message)
    Rails.logger.error(e.backtrace.join("\n"))
    if Rails.env.production?
      JSONAPI::Errors.serialize(
        JSONAPI::Errors::Wrapper.new(title: "#{e.class}", detail: e.message, backtrace: e.backtrace.join("\n"))
      ).to_json
    else
      raise e
    end
  end

  error JSONAPI::Error do
    response.status = e.status
    e.to_json
  end

  error NotFoundError do
    response.status = 401
    JSONAPI::Errors.serialize(JSONAPI::Errors::NotFound.new).to_json
  end

  error UnauthorizedError do
    response.status = 401
    JSONAPI::Errors.serialize(JSONAPI::Errors::Unauthorized.new).to_json
  end

  error ForbiddenError do
    response.status = 403
    JSONAPI::Errors.serialize(JSONAPI::Errors::Forbidden.new).to_json
  end
end
