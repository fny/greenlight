module Admin
  class LocationAccountsController < ApplicationController
    def edit
      @location_account = LocationAccount.find(params[:id])
    end

    def update
      @location_account = LocationAccount.find(params[:id])
      @location_account.assign_attributes(params.require(:location_account).permit!)
      if @location_account.save
        redirect_to [:admin, @location_account.user], notice: "Updated account at #{@location_account.location.name}"
      else
        render 'edit'
      end
    end

    def destroy
      @location_account = LocationAccount.find(params[:id])
    end
  end
end
