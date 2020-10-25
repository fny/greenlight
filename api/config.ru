# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'
require 'rack/protection'
require 'sidekiq/web'
require 'sidekiq/cron/web'

use Rack::Protection, instrumenter: ActiveSupport::Notifications

Sidekiq::Web.use(Rack::Auth::Basic) do |username, password|
  return true unless Rails.env.production?
  return false if ENV['SUPERUSER_PASSWORD'].blank?

  username == 'GreenLantern' && password == ENV['SUPERUSER_PASSWORD']
end

routes = {
  '/' => Rails.application,
  '/sidekiq' => Sidekiq::Web,
}

run Rack::URLMap.new(routes)
