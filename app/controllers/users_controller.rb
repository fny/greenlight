# frozen_string_literal: true
module UsersController
  extend ActiveSupport::Concern

  included do
    get '/v1/users/:user_id' do
      user_id = params[:user_id]
      user = User.includes(:location_accounts).find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      render json: UserSerializer.new(user)
    end

    patch '/v1/users/:user_id' do
      user_id = params[:user_id]
      user = User.includes(:location_accounts).find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }
      user.update(User.restrict_params(request_json))

      if user.save
        set_status_created
        render json: UserSerializer.new(user)
      else
        error_response(user)
      end
    end

    put '/v1/users/:user_id/complete-welcome' do
      user_id = params[:user_id]
      user = User.find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      user.update_column(:completed_welcome_at, Time.zone.now) unless user.completed_welcome_at # rubocop:disable Rails/SkipsModelValidations

      set_status_updated
      render json: UserSerializer.new(user)
    end

    patch '/v1/users/:user_id/settings' do
      user_id = params[:user_id]
      ensure_or_forbidden! { current_user.id == user_id }
      current_user.settings.assign_attributes(request_json)
      if current_user.settings.save
        set_status_updated
        render json: UserSettingsSerializer.new(current_user.settings)
      else
        error_response(current_user.settings)
      end
    end

    # On success responds with a greenlight status
    post '/v1/users/:user_id/symptom-surveys' do
      user_id = params[:user_id]
      user = User.includes(:location_accounts).find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      survey = SymptomSurvey.new(
        medical_events: request_json[:medical_events],
        user: user,
        created_by: current_user
      )

      return error_response(survey) unless survey.valid?

      if survey.save
        set_status_created
        render json: GreenlightStatusSerializer.new(survey.greenlight_status)
      else
        error_response(survey.greenlight_status)
      end
    end
  end
end
