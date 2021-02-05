module Admin
  class LocationUsersController < ApplicationController
    def index
      location = Location.find_by_id_or_permalink(params[:location_id])
      relationships = []
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
      users = if relationships.length == 1
          relationships[0]
        else
          User.union(*relationships)
        end
      @location = location
      @pagy, @users = pagy(users.order(:id))
    end
  end
end
