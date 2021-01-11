module Admin
  class AccountsController < ApplicationController
    def index
      @location = Location.find_by_id_or_permalink!(params[:location_id])
      @pagy, @accounts = pagy(@location.location_accounts.includes(user: :cohorts))
    end
  end
end
