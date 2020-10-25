module DebugController
  extend ActiveSupport::Concern
  included do
    get '/debug/time' do
      u = current_user
      {
        tz: Time.zone.name,
        current_user_tz: u && u.time_zone,
        time_now: Time.now,
        time_zone_now: Time.zone.now,
        created_at_time: u && u.created_at
      }.to_json
    end

    post '/debug/cookies' do
      cookies[:test] = 'test'
      success_json
    end

    delete '/debug/cookies' do
      cookies.delete(:test)
      success_json
    end

    get '/debug/cookies' do
      { test: cookies[:test] }.to_json
    end
  end
end
