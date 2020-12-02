# frozen_string_literal: true
module RootController
  extend ActiveSupport::Concern
  included do
    get '/', auth: false do
      render json: { howdy: developer_message }
    end

    get '/xnp9q8g7nvx9wmq197b0', auth: false do
      raise 'This error should show up in notifications and the logs.'
    end

    get '/ping', auth: false do
      render plain: 'pong'
    end

    get '/v1/ping', auth: false do
      render plain: 'pong'
    end

    get '/version', auth: false do
      render json: {
        'release_created_at': ENV['HEROKU_RELEASE_CREATED_AT'],
        'release_version': ENV['HEROKU_RELEASE_VERSION'],
        'slug_commit': ENV['HEROKU_SLUG_COMMIT'],
        'slug_description': ENV['HEROKU_SLUG_DESCRIPTION']
      }
    end

    # REFACTOR: This is not well named and needs a namespace
    post '/v1/send-invite' do
      user = User.find_by_email_or_mobile!(params[:emailOrMobile].strip.downcase)
      if user.completed_welcome_at
        head :not_found
      else
        InviteWorker.perform_async(user.id)
        success_response
      end
    end
  end
end
