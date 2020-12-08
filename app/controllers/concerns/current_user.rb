module CurrentUser
  extend ActiveSupport::Concern

  def current_user
    return @current_user if defined?(@current_user)

    @current_user = @session.user || User.new
    @current_user
  end

  def current_locale
    request.headers['HTTP_X_GL_LOCALE'] || current_user.locale
  end

  # @param [User] user>
  # @param [Boolean] remember_me>
  def sign_in(user, ip, remember_me: false)
    user.save_sign_in!(ip)
    @session = Session.new(cookies, user: user, remember_me: remember_me)
  end

  included do
    before_action do
      @session = Session.new(cookies)
      Time.zone = current_user.time_zone
      I18n.locale = current_locale

      request.env['exception_notifier.exception_data'] = {
        current_user: current_user
      }
    end
  end
end
