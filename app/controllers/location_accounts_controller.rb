module LocationAccountsController
  extend ActiveSupport::Concern

  included do
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
