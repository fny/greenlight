# frozen_string_literal: true
module LocationsUsersController
  extend ActiveSupport::Concern
  included do
    get '/v1/locations/:location_id/users' do |location_id|
      location = Location.find_by_id_or_permalink(location_id)
      if !location # || !current_user.admin_at?(location)
        return []
      end
      MobileLocationUserSerializer.new(
        location.users.includes(:location_accounts, :last_greenlight_status), include: MobileUserSerializer::ADMIN_INCLUDES
      ).serialized_json
    end
  end
end
