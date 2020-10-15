module UsersController
  extend ActiveSupport::Concern
  include ApplicationHelpers

  included do
    get '/v1/users/:id' do |id|
      user = lookup_user(id)
      raise ForbiddenError unless current_user.authorized_to_view?(user)

      MobileUserSerializer.new(
        user, include: MobileUserSerializer::COMMON_INCLUDES
      ).serialized_json
    end

    patch '/v1/users/:id' do |id|
      user = lookup_user(id)
      raise ForbiddenError unless current_user.authorized_to_view?(user)

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
      require_auth!
      user = lookup_user(user_id)
      raise ForbiddenError unless current_user.authorized_to_view?(user)

      survey = SymptomSurvey.new(
        medical_events: request_json[:medical_events],
        user: user,
        created_by: current_user
      )

      if !survey.valid?
        return error_response(survey)
      end


      if survey.save
        MobileGreenlightStatusSerializer.new(survey.greenlight_status).serialized_json
      else
        error_response(survey.greenlight_status)
      end
    end
  end
end
