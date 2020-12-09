module LocationAccountsController
  extend ActiveSupport::Concern

  included do
    patch '/v1/location-accounts/:location_account_id' do
      location_account = LocationAccount.find(params[:location_account_id])
      location = location_account.location

      ensure_or_forbidden! { current_user.admin_at?(location) }

      if params[:permissionLevel]
        location_account.update(permission_level: params[:permissionLevel])
      end

      set_status_updated
      render json: LocationAccountSerializer.new(location_account)
    end

    delete '/v1/location-accounts/:location_account_id' do
      location_account_id = params[:location_account_id]
      ensure_or_forbidden! { current_user.owner_of_la?(location_account_id) }

      la = LocationAccount.includes(:location).find(location_account_id)
      la.destroy

      LARemovalAlertAdminsWorker.perform_async(la.location.id, current_user.id)
      success_response
    end
  end
end
