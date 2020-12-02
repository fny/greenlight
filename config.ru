# frozen_string_literal: true

# This file is used by Rack-based servers to start the application.

require 'rack/freeze'
require_relative 'config/environment'

routes = {
  '/' => Rails.application
}

if ENV['SERVE_BUILD']
  use Rack::Static, urls: { '/' => 'index.html' }, root: 'client/build'
  routes['/'] = Rack::Directory.new('client/build')
  routes['/api'] = Rails.application
end
run Rack::URLMap.new(routes)
