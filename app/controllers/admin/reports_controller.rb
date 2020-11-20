# frozen_string_literal: true
class Admin::ReportsController < Admin::BaseController
  before_action :set_location, except: :index

  def index
    @locations = Location.all
  end

  def show
    @report = Reports::Location.new(@location).to_h.deep_symbolize_keys
  end

  private

  def set_location
    @location = Location.find(params[:id])
  end
end
