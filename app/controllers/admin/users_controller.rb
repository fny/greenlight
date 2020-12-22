module Admin
  class UsersController < ApplicationController
    def index
      users = User.q(params[:query])
      if params[:child] == '1' && params[:parent] == '1'
        flash.now[:alert] = "Can't pick both child and parent for now."
        params[:child] = '0'
        params[:parent] = '0'
      end
      if params[:child] == '1'
        users = users.children
      end
      if params[:parent] == '1'
        users = users.parents
      end
      if params[:staff] == '1'
      users = users.staff
      end

      @pagy, @users = pagy(users)
    end

    def new
      @user = User.new
    end

    def show
      @user = User.includes(
        :location_accounts, :locations, :parents, :children, :greenlight_statuses_last_week
      ).find(params[:id])
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
        redirect_to admin_users_path, notice: "Congrats! You deleted #{@user.full_name}"
      when "NUKE #{@user.first_name}"
        ActiveRecord::Base.transaction do
          # HACK: This should work but it doesn't
          @user.children.each(&:destroy)
          @user.parents.each(&:destroy)
          # @user.children.destroy_all
          # @user.parents.destroy_all
          @user.destroy
        end
        redirect_to admin_users_path, notice: "Congrats! You deleted #{@user.full_name} and others"
      else
        flash[:alert] = 'Incorrect confirmation code.'
        redirect_to [:admin, @user]
      end
    end

    def assign_location

    end

    def add_child
      @user = User.find(params[:user_id])
      @target_user = User.find(params[:child_id])
      if @target_user.first_name != params[:first_name]
        flash[:alert] = "First name didn't match. Given '#{params[:first_name]}' expected '#{@target_user.first_name}'"
      else
        @user.children << @target_user
        flash[:notice] = "Added #{@target_user.first_name} (ID: #{@target_user.id}) as child"
      end
      redirect_to [:admin, @user]
    end

    def remove_child
      @user = User.find(params[:user_id])
      @target_user = User.find(params[:child_id])
      if @target_user.first_name != params[:first_name]
        flash[:alert] = "First name didn't match. Given '#{params[:first_name]}' expected '#{@target_user.first_name}'"
      else
        @user.children.delete(@target_user)
        flash[:notice] = "Removed #{@target_user.first_name} (ID: #{@target_user.id}) as child"
      end
      redirect_to [:admin, @user]
    end

    def copy_children
      @user = User.find(params[:user_id])
      @target_user = User.find(params[:other_user_id])
      if @target_user.first_name != params[:first_name]
        flash[:alert] = "First name didn't match. Given '#{params[:first_name]}' expected '#{@target_user.first_name}'"
      else
        @user.children << @target_user.children
        flash[:notice] = "Copied children from #{@target_user.first_name} (ID: #{@target_user.id})"
      end
      redirect_to [:admin, @user]
    end
  end
end
