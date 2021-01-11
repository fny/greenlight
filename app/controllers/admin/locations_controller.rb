module Admin
  class LocationsController < ApplicationController
    def index
      @pagy, @locations = pagy(Location.q(params[:query]))
    end

    def new
      @location = Location.new
    end

    def show
      @location = Location.find(params[:id])
    end

    def create
      @location = Location.new(params.require(:location).permit!)
      if @location.save
        redirect_to admin_location_path(@location), notice: "#{@location.name} created!"
      else
        render 'new'
      end
    end

    def edit
      @location = Location.find(params[:id])
    end

    def update
      @location = Location.find(params[:id])
      @location.assign_attributes(params.require(:location).permit!)
      if @location.save
        redirect_to admin_location_path(@location), notice: "#{@location.name} updated!"
      else
        render 'new'
      end
    end

    def import_students
      @location = Location.find(params[:location_id])
      if params[:confirmation] == 'IMPORT STUDENTS'
        flash[:notice] = 'Student import started.'
        location = Location.find(params[:location_id])

        student_import = ImportStudentRoster.new(
          location: location,
          dry_run: params[:do_it] == '0',
          overwrite: params[:overwrite] == '1',
          created_by: current_user.persisted? ? current_user : nil
        )
        student_import.run
      else
        flash[:alert] = 'Incorrect confirmation code.'
      end
      redirect_to [:admin, @location]
    end

    def import_staff
      @location = Location.find(params[:location_id])
      if params[:confirmation] == 'IMPORT STAFF'
        flash[:notice] = 'Staff import started.'
        location = Location.find(params[:location_id])
        staff_import = ImportStaffRoster.new(
          location: location,
          dry_run: params[:do_it] == '0',
          overwrite: params[:overwrite] == '1',
          created_by: current_user.persisted? ? current_user : nil
        )
        staff_import.run
      else
        flash[:alert] = 'Incorrect confirmation code.'
      end
      redirect_to [:admin, @location]
    end

    def destroy
      @location = Location.find(params[:id])
      case params[:confirmation]
      when "DELETE #{@location.permalink}"
        @location.destroy
        redirect_to admin_locations_path, alert: "Congrats! You deleted #{@location.name}"
      when "NUKE #{@location.permalink}"
        ActiveRecord::Base.transaction do
          # HACK: Why doesn't destroy_all work?
          @location.users.each(&:destroy)
          @location.destroy
        end
        redirect_to admin_locations_path, alert: "Congrats! You deleted #{@location.name} and all its users"
      else
        flash[:alert] = 'Incorrect confirmation code.'
        redirect_to [:admin, @location]
      end
    end
  end
end
