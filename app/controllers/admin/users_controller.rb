module Admin
  class UsersController < ApplicationController
    def index
      @pagy, @users = pagy(User.q(params[:query]))
    end

    def new
      @user = User.new
    end

    def show
      @user = User.find(params[:id])
    end

    def create
      @user = User.new(params.require(:user).permit!)
      if @user.save
        redirect_to [:admin, @user], notice: "#{@user.full_name} created!"
      else
        render 'new'
      end
    end

    def edit
      @user = User.find(params[:id])
    end

    def update
      @user = User.find(params[:id])
      @user.assign_attributes(params.require(:user).permit!)
      if @user.save
        redirect_to [:admin, @user], notice: "#{@user.full_name} updated!"
      else
        render 'new'
      end
    end

    def destroy
      @user = User.find(params[:id])
      case params[:confirmation]
      when "DELETE #{@user.first_name}"
        @user.destroy
        redirect_to admin_locations_path, alert: "Congrats! You deleted #{@location.name}"
      else
        flash[:alert] = 'Incorrect confirmation code.'
        redirect_to [:admin, @user]
      end
    end
  end
end
