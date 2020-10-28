# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

GREENLIGHT_SUBDOMAIN_PATTERN = %r{\A[a-z-]+\.greenlightready.com\z}.freeze

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    if Rails.env.production?
      origins Greenlight::APP_URI.host
    else
      origins 'localhost:9991', '127.0.0.1:9991', 'app-dev.greenlightready.com', GREENLIGHT_SUBDOMAIN_PATTERN
    end

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true
  end
end
