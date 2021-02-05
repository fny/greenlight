# frozen_string_literal: true
module SmokeTestsController
  extend ActiveSupport::Concern

  included do
    post '/v1/smoke-tests', auth: false do
      service = SmokeTestService.new(params[:token])

      set_status_created
      render json: service.populate_and_return
    end

    delete '/v1/smoke-tests', auth: false do
      service = SmokeTestService.new(params[:token])
      service.purge

      success_response
    end
  end
end
