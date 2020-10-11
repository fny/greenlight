module RootController
  extend ActiveSupport::Concern
  included do
    get '/' do
      { howdy: developer_message }.to_json
    end

    get '/temp_remind' do
      Location.find_by(permalink: 'greenlight').remind_users_now
      SUCCESS
    end

    get '/temp_invite' do
      Location.find_by(permalink: 'greenlight').invite_users_now
      SUCCESS
    end

    get '/v1/ping' do
      'pong'
    end
  end
end
