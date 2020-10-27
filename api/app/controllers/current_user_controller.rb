module CurrentUserController
  extend ActiveSupport::Concern
  included do
    get '/v1/current-user' do
      ensure_or_not_found! { current_user.present? && current_user.persisted? }
      MobileUserSerializer.new(
        current_user,
        include: MobileUserSerializer::COMMON_INCLUDES
      ).serialized_json
    end
  end
end
