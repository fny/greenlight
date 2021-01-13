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
      location_account = LocationAccount.find(params[:location_account_id])
      location = location_account.location

      ensure_or_forbidden! { current_user.admin_at?(location) }

      location_account.destroy

      success_response
    end
  end
end
