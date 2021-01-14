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
        users = users.where(
          %w[first_name last_name].map { |col| "lower(#{col}) LIKE :query"}.join(' OR '),
          query: "%#{params[:query]}%"
        )
      end
      @pagy, @users = pagy(users, items: 25)

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

    post '/v1/locations/:location_id/users' do
      location = Location.find_by_id_or_permalink!(params[:location_id])
      ensure_or_forbidden! { current_user.admin_at? location }

      is_mobile_taken = User.mobile_taken?(request_json[:mobile_number])
      is_email_taken = User.email_taken?(request_json[:email])

      puts request_json[:mobile_number]
      puts request_json[:email]
      puts is_mobile_taken
      puts is_email_taken

      if is_mobile_taken || is_email_taken
        simple_error_response({
          source: { parameter: is_email_taken ? 'email' : 'mobile_number' },
          title: 'Already Taken',
          detail: 'User already exists. He/she should link his/her account to the location instead.'
        })
      else
        user = User.create_account!(
          **request_json.merge(location: location.id).symbolize_keys
        )

        InviteWorker.perform_async(user.id)

        set_status_created
        render json: UserSerializer.new(user)
      end
    end

    patch '/v1/locations/:location_id/users/:user_id' do
      location = Location.find_by_id_or_permalink!(params[:location_id])
      user = User.find(params[:user_id])

      ensure_or_forbidden! { current_user.admin_at? location }
      ensure_or_forbidden! { user.location_accounts.exists?(location_id: location.id) }

      user.update_account!(
        **request_json.merge(location: location.id).symbolize_keys
      )

      set_status_updated
      render json: UserSerializer.new(user)
    end

    delete '/v1/locations/:location_id/users/:user_id' do
      location = Location.find_by_id_or_permalink!(params[:location_id])
      user = User.find(params[:user_id])

      ensure_or_forbidden! { current_user.admin_at? location }
      ensure_or_forbidden! { user.location_accounts.exists?(location_id: location.id) }

      if params[:nuke]
        ActiveRecord::Base.transaction do
          user.children.each(&:destroy)
          user.destroy
        end
      else
        user.destroy
      end

      success_response
    end
  end
end
