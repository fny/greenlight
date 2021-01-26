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
      location.category = 'business'
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

    post '/v1/locations/:location_id/register', auth: false do
      location = Location.find_by_id_or_permalink!(params[:location_id])
      params[:location] = location

      register = RegisterAccount.new(params)
      if register.run
        user = register.result
        sign_in(user, request.remote_ip)
        render json: CurrentUserSerializer.new(user)
      else
        error_response(register)
      end
    end

    post '/v1/locations/:location_id/join' do
      location_id = params[:location_id]

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

      users = location.users.order_by_name.includes(:last_greenlight_status, :location_accounts, :cohort_users, :cohorts)

      name_filter = params.dig(:filter, :name)
      status_filter = params.dig(:filter, :status)
      role_filter = params.dig(:filter, :role)

      if role_filter.present?
        users = users.joins(:location_accounts).where(location_accounts: { location: location, role: role_filter })
      end

      if status_filter.present?
        users = users.joins(:greenlight_statuses).where('greenlight_statuses.expiration_date >= ?', Date.current).where(greenlight_statuses: { status: status_filter })
      end

      if name_filter.present?
        users = users.where('lower(concat(first_name, last_name)) LIKE :name_filter', name_filter: "%#{name_filter}%")
      end
      @pagy, @users = pagy(users, items: 20)

      render json: UserSerializer.new(
        @users,
        include: UserSerializer::ADMIN_INCLUDES,
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

    # check registration code
    post '/v1/locations/:location_id/check-registration-code', auth: false do
      location = Location.find_by_id_or_permalink!(params[:location_id])

      response = location.registration_type(request_json[:registration_code])

      if response == :invalid
        simple_error_response(:invalid)
      else
        render json: {
          result: response
        }
      end
    end
  end
end
