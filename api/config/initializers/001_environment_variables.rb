Configurator.new(Greenlight) do
  set :BASE_URL, 'https://greenlightready.com'
  set :SHORT_URL, 'https://glit.me'
  env :PLIVO_AUTH_ID, required: false
  env :PLIVO_AUTH_TOKEN, required: false
  env :SKYLIGHT_AUTHENTICATION, required: false

  set :API_BASE_URL do
    if ENV.key?('API_BASE_URL')
      ENV.fetch('API_BASE_URL')
    elsif ENV.key?('HEROKU_APP_NAME')
      "https://#{ENV.fetch('HEROKU_APP_NAME')}.herokuapp.com"
    elsif Rails.env.development? || Rails.env.test?
      'http://localhost:3000'
    else
      raise MissingEnvironmentVariable.new(:API_BASE_URL)
    end
  end

  set :API_BASE_URI do
    URI(API_BASE_URL)
  end
end
