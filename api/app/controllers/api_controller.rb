
# TODO Move these into a helper
UnauthorizedError = Class.new(StandardError)
NotFoundError = Class.new(StandardError)
ForbiddenError = Class.new(StandardError)

require 'sidekiq/web'
require 'sidekiq/cron/web'

class APIController < Sinatra::Base
  include APIHelpers
  SUCCESS = {success: true}.to_json
  FAILURE = {success: false}.to_json

  set :show_exceptions, false

  before do
    @session = Session.new(token: request.env['HTTP_AUTHORIZATION'])
  end

  # mount Sidekiq::Web, at: '/sidekiq'

  get '/' do
    developer_message
  end

  get '/temp_remind' do
    Location.find_by(permalink: 'greenlight').remind_users_now
    SUCCESS
  end

  get '/temp_invite' do
    Location.find_by(permalink: 'greenlight').invite_users_now
    SUCCESS
  end

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
  end

  post '/v1/magic-sign-in/:token' do
    user = User.find_by!(magic_sign_in_token: token)
    user.save_sign_in!(r.ip)
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

  get '/v1/users/:id' do |id|
    user = lookup_user(id)
    raise ForbiddenError unless current_user.authorized_to_view?(user)

    includes = [
      :locations, :location_accounts, :recent_medical_events, :recent_greenlight_statuses, :greenlight_statuses, :last_greenlight_status,
      :'location_accounts.location',
      :children,
      :'children.locations', :'children.location_accounts', :'children.recent_medical_events', :'children.recent_greenlight_statuses',
      :'children.location_accounts.location', :'children.greenlight_statuses', :'children.last_greenlight_status'
    ]
    MobileUserSerializer.new(
      user, include: includes
    ).serialized_json
  end

  patch '/v1/users/:id' do |id|
    user = lookup_user(id)
    raise ForbiddenError unless current_user.authorized_to_view?(user)

    # TODO: Mass assignment vulenrability
    user.update_attributes(request_json)

    if user.save
      response.status = 201
      UserSerializer.new(user).serialized_json
    else
      error_response(user)
    end
  end

  post '/v1/users/:user_id/symptom-surveys' do |user_id|
    require_auth!
    user = lookup_user(user_id)
    raise ForbiddenError unless current_user.authorized_to_view?(user)

    survey = SymptomSurvey.new(
      medical_events: request_json[:medical_events],
      user: user,
      created_by: current_user
    )

    if !survey.valid?
      return error_response(survey)
    end


    if survey.save
      MobileGreenlightStatusSerializer.new(survey.greenlight_status).serialized_json
    else
      error_response(survey.greenlight_status)
    end
  end

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
