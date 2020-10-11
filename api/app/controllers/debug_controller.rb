module DebugController
  extend ActiveSupport::Concern
  included do
    get '/v1/debug/time' do
      u = User.first
      u.time_zone = :mountain
      {
        tz: Time.zone.name,
        current_user_tz: u && u.time_zone,
        time_now: Time.now,
        time_zone_now: Time.zone.now,
        created_at_time: u && u.created_at
      }.to_json
    end
  end
end
