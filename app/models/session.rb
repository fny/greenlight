# frozen_string_literal: true
class Session
  InvalidSessionError = Class.new(StandardError)

  COOKIE_NAME = '_gl_session'.freeze

  attr_reader :user, :data, :cookies

  def initialize(cookies, user: nil, remember_me: false)
    @cookies = cookies
    @data = {}

    if cookies.encrypted[COOKIE_NAME]
      @data = cookies.encrypted[COOKIE_NAME]
      @user = User.find_by(auth_token: @data[:auth_token])
      # Destroy the session if the auth token is invalid
      self.destroy if @user.nil?
    end

    if user
      @data = { auth_token: user.auth_token, user_id: user.id }
      @user = user
      cookie = {
        value: @data,
        httponly: true,
        secure: Rails.env.production?,
        domain: Greenlight::COOKIE_DOMAINS,
        same_site: :strict
      }

      cookie[:expires] = 1.year.from_now if remember_me

      cookies.encrypted[COOKIE_NAME] = cookie
    end

    @user ||= User.new
  end

  def signed_in?
    user.persisted?
  end

  def user_id
    data[:user_id]
  end

  def locale
    user.locale
  end

  def time_zone
    user.time_zone
  end

  def destroy
    user.reset_auth_token! if user && user.persisted?
    cookies.delete(COOKIE_NAME)
  end
end