module CovidDataController
  extend ActiveSupport::Concern

  included do
    # Get data from database
    get '/v1/covid-data' do
      render json: CovidDataSerializer.new(
        CovidData.all
      )
    end

    # Update Covid data manually
    get '/v1/covid-data/update' do
      CovidDataWorker.perform_async

      success_response
    end
  end
end
