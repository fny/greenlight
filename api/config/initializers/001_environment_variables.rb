Configurator.new(Greenlight) do
  env :PLIVO_AUTH_ID, required: false
  env :PLIVO_AUTH_TOKEN, required: false
  env :SKYLIGHT_AUTHENTICATION, required: false
  env :REDIS_PERSISTENT_URL
  env :SHORT_URL
  env :APP_URL
  env :ADMIN_URL
  env :MAILGUN_API_KEY
  env :MAILGUN_DOMAIN
  env :MAILGUN_SMTP_USERNAME
  env :MAILGUN_SMTP_PASSWORD
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
