module Admin
  class UsersController < ApplicationController
    def index
      location = Location.find_by(permalink: params[:location])

      relationships = []
      if location
        if params[:child] == '1'
          (relationships << location.students)
        elsif params[:parent] == '1'
          (relationships << location.parents)
        elsif params[:staff] == '1'
          (relationships << location.staff)
          (relationships << location.teachers)
        else
          relationships << location.users
          relationships << location.parents
        end
      else
        (relationships << User.q(params[:query]).children) if params[:child] == '1'
        (relationships << User.q(params[:query]).parents) if params[:parent] == '1'
        (relationships << User.q(params[:query]).not_students) if params[:staff] == '1'
      end

      users = case relationships.length
        when 0
          User.q(params[:query])
        when 1
          relationships[0]
        else
          User.union(*relationships)
        end


      respond_to do |f|
        f.html {
          @pagy, @users = pagy(users.order(id: :desc))
        }

        f.xlsx {
          download = UsersDownload.new
          download.run
          send_data File.read(download.file_path).force_encoding('binary'),
            filename: File.basename(download.file_path),
            type: 'application/vnd.ms-excel'
        }
      end
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

    def refresh_reset
      @user = User.find(params[:user_id])
      @user.generate_password_token!
      redirect_to [:admin, @user]
    end

    def join_location
      @user = User.find_by(id: params[:user_id])
      @location = Location.find_by_id_or_permalink(params[:location])
      @la = LocationAccount.new(
        user: @user,
        location: @location,
        role: params[:role],
        permission_level: params[:permission_level],
        external_id: params[:external_id],
      )

      if @la.save
        flash[:notice] = "#{@user.first_name} (ID: #{@user.id}) added to #{@location.permalink}"
      else
        flash[:alert] = @la.errors.to_json
      end
      redirect_to [:admin, @user]
    end
  end
end
