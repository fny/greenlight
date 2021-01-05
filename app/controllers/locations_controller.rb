# frozen_string_literal: true
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

    get '/v1/locations/:location_id/users' do
      location = Location.find_by_id_or_permalink(params[:location_id])
      return [] unless location || !current_user.admin_at?(location)

      # We do not include the current user because it may conflict with data
      # in the store.
      users = location.users.where.not(id: current_user.id)
        .includes(UserSerializer::ADMIN_INCLUDES.dup).order(last_name: :asc, first_name: :asc, id: :asc)
      if params[:query]
        if params[:query].start_with?('clea')
          users = users.where(last_greenlight_status: { status: :cleared })
        elsif params[:query].start_with?('pend')
          users = users.where(last_greenlight_status: { status: :pendng })
        elsif params[:query].start_with?('rec')
          users = users.where(last_greenlight_status: { status: :recovery })
        elsif params[:query].start_with?('not')
          users = users.where(last_greenlight_status: nil)
        else
          users = users.where(
            %w[first_name last_name].map { |col| "lower(#{col}) LIKE :query"}.join(' OR '),
            query: "%#{params[:query]}%"
          )
        end
      end
      @pagy, @users = pagy(users, items: 15)

      render json: UserSerializer.new(
        @users,
        include: UserSerializer::ADMIN_INCLUDES.dup,
        # links: pagy_links(@pagy),
        meta: { pagination: pagy_numbers(@pagy) }
      )
    end

    get '/v1/locations/:location_id/report' do
      location_id = params[:location_id]
      location = Location.find_by_id_or_permalink(location_id)
      return {} unless location || !current_user.admin_at?(location)

      render json: Reports::Location.new(location).to_h
    end

    get '/v1/locations/:location_id/stats-overview/:date' do
      location = Location.find_by_id_or_permalink!(params[:location_id])
      stats = LocationStatsOverview.new(location, params[:date])
      render json: LocationStatsOverviewSerializer.new(stats)
    end
  end
end
