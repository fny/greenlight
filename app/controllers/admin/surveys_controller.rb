module Admin
  class SurveysController < ApplicationController
    before_action :set_survey, except: [:index, :new, :create]
  
    def index
      @pagy, @surveys = pagy(Survey.all.order(:id))
    end

    def show
      @result = SurveyResult.new(@survey).result_presentable
    end

    def location
      @location = Location.find(params[:location_id])
      @result = SurveyResult.new(
        @survey,
        @survey.survey_responses.at_locations(@location.id)
      ).result_presentable
    end

    def new
      @survey = Survey.new
    end

    def create
      @survey = Survey.new(params.require(:survey).permit!)
      if @survey.save
        redirect_to admin_survey_path(@survey), notice: "#{@survey.question} created!"
      else
        render 'new'
      end
    end

    def edit; end

    def update
      @survey.assign_attributes(params.require(:survey).permit!)
      if @survey.save
        redirect_to admin_survey_path(@survey), notice: "#{@survey.question} updated!"
      else
        render 'edit'
      end
    end

    def destroy
      if params[:confirmation] == "DELETE #{@survey.permalink[0..3].upcase}"
        @survey.destroy
        redirect_to admin_surveys_path, notice: "Congrats! You deleted Survey: #{@survey.question}"
      else
        flash[:alert] = 'Incorrect confirmation code.'
        redirect_to [:admin, @survey]
      end
    end

    private

    def set_survey
      @survey = Survey.find(params[:id])
    end
  end
end
