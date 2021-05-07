# frozen_string_literal: true
module CurrentUserController
  extend ActiveSupport::Concern
  included do
    get '/v1/current-user' do
      begin current_user.update_column(:last_seen_at, Time.now); rescue; end
      render json: CurrentUserSerializer.new(
        current_user,
        include: CurrentUserSerializer::INCLUDES
      )
    end

    patch '/v1/current-user' do
      if current_user.update(User.restrict_params(request_json, [:password]))
        set_status_updated
        render json: CurrentUserSerializer.new(current_user)
      else
        error_response(current_user)
      end
    end
  end
end
