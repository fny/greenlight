# frozen_string_literal: true
module CurrentUserController
  extend ActiveSupport::Concern
  included do
    get '/v1/current-user' do
      render json: CurrentUserSerializer.new(
        current_user,
        include: CurrentUserSerializer::INCLUDES
      )
    end
  end
end
