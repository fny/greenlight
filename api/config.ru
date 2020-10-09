# This file is used by Rack-based servers to start the application.

require_relative 'config/environment'
require 'sidekiq/web'
require 'sidekiq/cron/web'

Sidekiq::Web.use(Rack::Auth::Basic) do |username, password|
  username == 'foo' && password == 'bar'
end
run Rack::URLMap.new(
  '/' => Rails.application,
  '/sidekiq' => Sidekiq::Web
)
