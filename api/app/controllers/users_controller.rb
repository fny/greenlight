module UsersController
  extend ActiveSupport::Concern
  include ApplicationHelpers

  included do
    get '/v1/users/:user_id' do |user_id|
      user = User.includes(:location_accounts).find_by!(id: user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      UserSerializer.new(user).serialized_json
    end

    patch '/v1/users/:user_id' do |user_id|
      user = User.includes(:location_accounts).find_by!(id: user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      # TODO: Mass assignment vulenrability
      user.update_attributes(request_json)

      if user.save
        response.status = 201
        UserSerializer.new(user).serialized_json
      else
        error_response(user)
      end
    end

    # On success responds with a greenlight status
    post '/v1/users/:user_id/symptom-surveys' do |user_id|
      user = User.includes(:location_accounts).find_by!(id: user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      survey = SymptomSurvey.new(
        medical_events: request_json[:medical_events],
        user: user,
        created_by: current_user
      )

      return error_response(survey) unless survey.valid?

      if survey.save
        MobileGreenlightStatusSerializer.new(survey.greenlight_status).serialized_json
      else
        error_response(survey.greenlight_status)
      end
    end
  end
end
