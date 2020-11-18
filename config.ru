# frozen_string_literal: true

# This file is used by Rack-based servers to start the application.

require 'rack/freeze'
require 'sidekiq/web'
require 'sidekiq/cron/web'

require_relative 'config/environment'

Sidekiq::Web.use(Rack::Auth::Basic) do |username, password|
  return true unless Rails.env.production?
  return false if ENV['SUPERUSER_PASSWORD'].blank?

  username == 'GreenLantern' && password == ENV['SUPERUSER_PASSWORD']
end

routes = {
  '/' => Rails.application,
  '/sidekiq' => Sidekiq::Web
}

if ENV['SERVE_BUILD']
  use Rack::Static, urls: { '/' => 'index.html' }, root: 'client/build'
  routes['/'] = Rack::Directory.new('client/build')
  routes['/api'] = Rails.application
end
run Rack::URLMap.new(routes)
