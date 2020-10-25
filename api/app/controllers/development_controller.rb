module DevelopmentController
  extend ActiveSupport::Concern
  included do
    get '/dev/session' do
      @session.data.to_json
    end
  end
end
