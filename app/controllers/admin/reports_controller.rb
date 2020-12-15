# frozen_string_literal: true
module Admin
  class ReportsController < ApplicationController
    before_action :set_location, except: :index

    def index
      @owners = Reports::Location.owners
      @registrations = Reports::Location.registrations
    end

    def show
      @report = Reports::Location.new(@location).to_h.deep_symbolize_keys
    end

    private

    def set_location
      @location = Location.find(params[:id])
    end
  end
end
