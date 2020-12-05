# frozen_string_literal: true

module DevelopmentController
  extend ActiveSupport::Concern

  included do
    get '/dev/session' do
      @session.data.to_json
    end

    # Used to test authentication
    get '/dev/authenticated' do
      success_response
    end

    # Used to test authentication
    get '/dev/unauthentated', auth: false do
      success_response
    end
  end
end
