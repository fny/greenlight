module LocationsController
  extend ActiveSupport::Concern

  included do
    get '/v1/locations/:location_id' do
      location_id = params[:location_id]
      location = Location.find_by_id_or_permalink(location_id)

      LocationSerializer.new(location)
    end

    get '/v1/locations/:location_id/users' do
      location_id = params[:location_id]
      location = Location.find_by_id_or_permalink(location_id)
      return [] unless location || !current_user.admin_at?(location)

      render json: UserSerializer.new(
        location.users.where.not(id: current_user.id).includes(:location_accounts, :last_greenlight_status), include: UserSerializer::ADMIN_INCLUDES
      )
    end

    get '/v1/locations/:location_id/report' do
      location_id = params[:location_id]
      location = Location.find_by_id_or_permalink(location_id)
      return {} unless location || !current_user.admin_at?(location)

      render json: Reports::Location.new(location).to_h
    end
  end
end
