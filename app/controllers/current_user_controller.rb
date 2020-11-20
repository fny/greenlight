# frozen_string_literal: true
module CurrentUserController
  extend ActiveSupport::Concern
  included do
    get '/v1/current-user' do
      render json: UserSerializer.new(
        current_user,
        include: UserSerializer::PERSONAL_INCLUDES.dup
      )
    end
  end
end
