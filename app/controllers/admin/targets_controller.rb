# frozen_literal_string: true
module Admin
  class TargetsController < ApplicationController
    before_action :set_survey

    def index
      @pagy, @locations = pagy(Location.q(params[:query]))
    end

    def update
      @survey.send_to_locations([params[:id]])
    end

    private

    def set_survey
      @survey = Survey.find(params[:survey_id])
    end
  end
end
