if Rails.application.secrets.secret_key_base.nil?
  raise Configurator::MissingEnvironmentVariable.new(:SECRET_KEY_BASE)
end

Configurator.new(Greenlight) do
  get :PLIVO_AUTH_ID
  get :PLIVO_AUTH_TOKEN
  get :SKYLIGHT_AUTHENTICATION
  get :REDIS_PERSISTENT_URL
  get :SHORT_URL
  get :APP_URL
  get :SENDGRID_API_KEY

  set :API_URL do
    if ENV.key?('API_URL')
      ENV.fetch('API_URL')
    elsif ENV.key?('HEROKU_APP_NAME')
      "https://#{ENV.fetch('HEROKU_APP_NAME')}.herokuapp.com"
    else
      raise Configurator::MissingEnvironmentVariable.new(:API_URL)
    end
  end

  set :API_URI do
    URI(Greenlight::API_URL)
  end

  set :APP_URI do
    URI(Greenlight::APP_URL)
  end

  set :EXCEPTION_RECIPIENTS do
    recipients = ENV['EXCEPTION_RECIPIENTS']
    if recipients.blank?
      []
    else
      recipients.split(' ')
    end
  end

  set :PHONE_NUMBER, '19197285377'
  set :SUPPORTED_LOCALES, %w[en es]
end
