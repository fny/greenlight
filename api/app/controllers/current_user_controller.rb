# frozen_string_literal: true
module CurrentUserController
  extend ActiveSupport::Concern
  included do
    get '/v1/current-user' do
      ensure_authenticated!
      MobileUserSerializer.new(
        current_user,
        include: MobileUserSerializer::COMMON_INCLUDES
      ).serialized_json
    end
  end
end
