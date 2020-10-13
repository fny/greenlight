# require 'lib/configurator'

if Rails.application.secrets.secret_key_base.nil?
  raise MissingEnvironmentVariable.new(:SECRET_KEY_BASE)
end

Configurator.new(Greenlight) do
  env :PLIVO_AUTH_ID
  env :PLIVO_AUTH_TOKEN
  env :SKYLIGHT_AUTHENTICATION
  env :REDIS_PERSISTENT_URL
  env :SHORT_URL
  env :APP_URL
  env :ADMIN_URL
  env :SENDGRID_API_KEY

  set :API_URL do
    if ENV.key?('API_URL')
      ENV.fetch('API_URL')
    elsif ENV.key?('HEROKU_APP_NAME')
      "https://#{ENV.fetch('HEROKU_APP_NAME')}.herokuapp.com"
    else
      raise MissingEnvironmentVariable.new(:API_URL)
    end
  end

  set :API_URI do
    URI(Greenlight::API_URL)
  end

  set :EXCEPTION_RECIPIENTS do
    recipients = ENV['EXCEPTION_RECIPIENTS']
    if recipients.blank?
      []
    else
      recipients.split(' ')
    end
  end

end
