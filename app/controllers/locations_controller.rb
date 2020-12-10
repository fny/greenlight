module LocationsController
  extend ActiveSupport::Concern

  included do
    get '/v1/locations/:location_id', auth: false do
      location_id = params[:location_id]
      location = Location.find_by_id_or_permalink!(location_id)

      render json: LocationSerializer.new(location)
    end

    post '/v1/locations' do
      location = Location.new(Location.restrict_params(request_json))
      location.category = 'other'
      location.created_by = current_user

      if current_user.locations.exists?(id: location.id)
        render json: LocationAccountSerializer.new(la)
        return
      end

      ActiveRecord::Base.transaction do
        is_loc_saved = location.save
        la = LocationAccount.new(
          user_id: current_user.id,
          location: location,
          permission_level: LocationAccount::OWNER,
          role: 'unknown',
          created_by: current_user
        )

        if is_loc_saved && la.save
          set_status_created
          CreatedLocationWorker.perform_async(current_user.id, location.id)
          render json: LocationSerializer.new(location)
        else
          error_response(la)
        end
      end
    end

    post '/v1/locations/:location_id/join' do
      location_id = params[:location_id]
      location = Location.find_by_id_or_permalink!(location_id)
      la = current_user.location_accounts.where(location_id: location_id).first
      if la
        render json: LocationAccountSerializer.new(la)
        return
      end

      la = LocationAccount.new(
        user_id: current_user.id,
        location: location,
        permission_level: LocationAccount::NONE,
        role: 'unknown',
        created_by: current_user
      )

      if la.save
        set_status_created
        render json: LocationAccountSerializer.new(la)
      else
        error_response(la)
      end
    end

    post '/v1/locations' do
      location = Location.new(Location.restrict_params(request_json))
      location.category = 'other'
      location.created_by = current_user

      if current_user.locations.exists?(id: location.id)
        render json: LocationAccountSerializer.new(la)
        return
      end

      ActiveRecord::Base.transaction do
        is_loc_saved = location.save
        la = LocationAccount.new(
          user_id: current_user.id,
          location: location,
          permission_level: LocationAccount::OWNER,
          role: 'unknown',
          created_by: current_user
        )

        if is_loc_saved && la.save
          set_status_created
          CreatedLocationWorker.perform_async(current_user.id, location.id)
          render json: LocationSerializer.new(location)
        else
          error_response(la)
        end
      end
    end

    post '/v1/locations/:location_id/join' do
      location_id = params[:location_id]
      location = Location.find_by_id_or_permalink!(location_id)
      la = current_user.location_accounts.where(location_id: location_id).first
      if la
        render json: LocationAccountSerializer.new(la)
        return
      end

      la = LocationAccount.new(
        user_id: current_user.id,
        location: location,
        permission_level: LocationAccount::NONE,
        role: 'unknown',
        created_by: current_user
      )

      if la.save
        set_status_created
        render json: LocationAccountSerializer.new(la)
      else
        error_response(la)
      end
    end
    get '/v1/locations/:location_id/users' do
      location = Location.find_by_id_or_permalink(params[:location_id])
      return [] unless location || !current_user.admin_at?(location)

      # We do not include the current user because it may conflict with data
      # in the store.
      users = location.users.where.not(id: current_user.id)
        .includes(UserSerializer::ADMIN_INCLUDES.dup)

      render json: UserSerializer.new(users, include: UserSerializer::ADMIN_INCLUDES.dup)
    end

    get '/v1/locations/:location_id/report' do
      location_id = params[:location_id]
      location = Location.find_by_id_or_permalink(location_id)
      return {} unless location || !current_user.admin_at?(location)

      render json: Reports::Location.new(location).to_h
    end
  end
end
