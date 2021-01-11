require 'configurator'

if Rails.application.secrets.secret_key_base.nil?
  raise Configurator::MissingEnvironmentVariable.new(:SECRET_KEY_BASE)
end

Configurator.new(Greenlight) do
  get :PLIVO_AUTH_ID
  get :PLIVO_AUTH_TOKEN
  get :SKYLIGHT_AUTHENTICATION
  get :REDIS_PERSISTENT_URL
  get :SHORT_URL
  get :SENDGRID_API_KEY
  get :AWS_ACCESS_KEY_ID
  get :AWS_SECRET_ACCESS_KEY
  get :AWS_BUCKET
  get :AWS_REGION

  set :API_URL do
    if ENV.key?('API_URL')
      ENV.fetch('API_URL')
    elsif ENV.key?('HEROKU_APP_NAME')
      "https://#{ENV.fetch('HEROKU_APP_NAME')}.herokuapp.com/api"
    else
      raise Configurator::MissingEnvironmentVariable.new(:API_URL)
    end
  end

  set :APP_URL do
    if ENV.key?('APP_URL')
      ENV.fetch('APP_URL')
    elsif ENV.key?('HEROKU_APP_NAME')
      "https://#{ENV.fetch('HEROKU_APP_NAME')}.herokuapp.com"
    else
      raise Configurator::MissingEnvironmentVariable.new(:APP_URL)
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

  set :COOKIE_DOMAINS do
    Set.new([Greenlight::API_URI, Greenlight::APP_URI].map { |u|
      names = u.host.split('.')
      names.length > 2 ? ".#{names[-2..].join('.')}" : u.host
    }).to_a
  end

  set :PHONE_NUMBER, '19197285377'
  set :SUPPORTED_LOCALES, %w[en es]
end


$stdout.puts("=> API URL: #{Greenlight::API_URL}")
$stdout.puts("=> APP URL: #{Greenlight::APP_URL}")
$stdout.puts("* Cookie Domains: #{Greenlight::COOKIE_DOMAINS}")
