# frozen_string_literal: true
module RootController
  extend ActiveSupport::Concern
  included do
    get '/' do
      render json: { howdy: developer_message }
    end

    get '/xnp9q8g7nvx9wmq197b0' do
      raise "This error should show up in notifications and the logs."
    end

    get '/ping' do
      render plain: 'pong'
    end

    get '/v1/ping' do
      render plain: 'pong'
    end

    get '/version' do
      render json: {
        'release_created_at': ENV['HEROKU_RELEASE_CREATED_AT'],
        'release_version': ENV['HEROKU_RELEASE_VERSION'],
        'slug_commit': ENV['HEROKU_SLUG_COMMIT'],
        'slug_description': ENV['HEROKU_SLUG_DESCRIPTION']
      }
    end
  end
end
