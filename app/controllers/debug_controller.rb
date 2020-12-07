# frozen_string_literal: true
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

    # Used to test authentication
    get '/debug/authenticated' do
      success_response
    end

    # Used to test authentication
    get '/debug/unauthenticated', auth: false do
      success_response
    end
  end
end
