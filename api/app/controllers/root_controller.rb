# frozen_string_literal: true
module RootController
  extend ActiveSupport::Concern
  included do
    get '/' do
      { howdy: developer_message }.to_json
    end

    get '/xnp9q8g7nvx9wmq197b0' do
      raise "This error should show up in notifications and the logs."
    end

    get '/ping' do
      'pong'
    end

    get '/v1/ping' do
      'pong'
    end

    get '/version' do
      {
        'release_created_at': ENV['HEROKU_RELEASE_CREATED_AT'],
        'release_version': ENV['HEROKU_RELEASE_VERSION'],
        'slug_commit': ENV['HEROKU_SLUG_COMMIT'],
        'slug_description': ENV['HEROKU_SLUG_DESCRIPTION']
      }.to_json
    end
  end
end
