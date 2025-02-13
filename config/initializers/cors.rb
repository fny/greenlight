# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors


Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    if Rails.env.production?
      origins Greenlight::APP_URI.host
    else
      origins Greenlight::APP_URI.host,
              'localhost:9991',
              '127.0.0.1:9991',
              'localhost:8000',
              'app-dev.greenlightready.com',
              'app-dev.greenlightready.com:9991',
              'app.greenlightready.net',
              'app.greenlightready.net:9991',
              %r{\A[a-z-]+\.greenlightready.net\z}
    end

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true
  end
end
