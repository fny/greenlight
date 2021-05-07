# frozen_string_literal: true
module UsersController
  extend ActiveSupport::Concern

  included do
    # Show a user
    get '/v1/users/:user_id' do
      user = User.includes(:locations, :location_accounts).find(params[:user_id])
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      render json: UserSerializer.new(user, include: UserSerializer::COMMON_INCLUDES)
    end

    get '/v1/users/:user_id/parents' do
      user = User.find(params[:user_id])
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      render json: UserSerializer.new(user.parents)
    end

    # Update a user
    patch '/v1/users/:user_id' do
      user = User.find(params[:user_id])
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      if user.update(User.restrict_params(request_json))
        set_status_updated
        render json: UserSerializer.new(user)
      else
        error_response(user)
      end
    end

    # Delete a user (self)
    delete '/v1/users/:user_id' do
      ensure_or_forbidden! { current_user.id == params[:user_id].to_i }

      current_user.purge!
      @session.destroy

      success_response
    end

    # Create a user
    post '/v1/users/create-and-sign-in', auth: false do
      user = User.new(User.restrict_params(request_json))
      if user.save
        set_status_created
        sign_in(user, request.ip)
        success_response_with_token
      else
        error_response(user)
      end
    end

    # Mark a user as having completed the welcome sequence
    put '/v1/users/:user_id/complete-welcome' do
      user_id = params[:user_id]
      user = User.find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      user.update_column(:completed_welcome_at, Time.zone.now) unless user.completed_welcome_at # rubocop:disable Rails/SkipsModelValidations

      set_status_updated
      render json: UserSerializer.new(user)
    end

    # Update the users settings
    patch '/v1/users/:user_id/settings' do
      user_id = params[:user_id]
      ensure_or_forbidden! { current_user.id.to_s == user_id }
      current_user.build_settings if current_user.settings.nil?
      current_user.settings.assign_attributes(request_json)

      if current_user.settings.save
        set_status_updated
        render json: UserSettingsSerializer.new(current_user.settings)
      else
        error_response(current_user.settings)
      end
    end

    # Create a survey for a user
    post '/v1/users/:user_id/symptom-surveys' do
      user_id = params[:user_id]
      user = User.includes(:location_accounts).find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_view?(user) }

      survey = SymptomSurvey.new(
        medical_events: request_json[:medical_events],
        user: user,
        created_by: current_user,
      )

      return error_response(survey) unless survey.valid?

      if survey.save
        set_status_created
        render json: GreenlightStatusSerializer.new(survey.greenlight_status)
      else
        error_response(survey.greenlight_status)
      end
    end

    # Guest symptom survey
    post '/v1/users/guest/guest-symptom-surveys', auth: false do
      survey = SymptomSurvey.new(
        medical_events: request_json[:medical_events],
      )
      survey.process
      render json: GreenlightStatusSerializer.new(survey.greenlight_status)
    end

    # Update last greenlight status
    patch '/v1/users/:user_id/last-greenlight-status' do
      user = User.find(params[:user_id])
      ensure_or_forbidden! { current_user.authorized_to_edit?(user) }

      status = user.last_greenlight_status
      if !status
        simple_error_response("no last status")
      elsif status.update(expiration_date: params[:expirationDate], status: params[:status], is_override: true)
        render json: GreenlightStatusSerializer.new(status)
      else
        error_response(status)
      end
    end

    # Delete last greenlight status
    delete '/v1/users/:user_id/last-greenlight-status' do
      user = User.find(params[:user_id])
      ensure_or_forbidden! { current_user.authorized_to_edit?(user) }

      status = user.last_greenlight_status
      if status&.destroy
        success_response
      else
        simple_error_response("failed to delete status")
      end
    end

    # Add a new child
    post '/v1/users/:user_id/child' do
      user_id = params[:user_id]
      user = User.find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_edit?(user) }

      unless params[:locationId] && user.locations.map { |l| l.id.to_s === params[:locationId] }
        simple_error_response("invalid school provided")
      else
        user.children << User.new(
          first_name: request_json[:first_name],
          last_name: request_json[:last_name],
          needs_physician: request_json[:needs_physician] || false,
          physician_name: request_json[:physician_name],
          physician_phone_number: request_json[:physician_phone_number],
          location_accounts: [LocationAccount.new(
            permission_level: LocationAccount::NONE,
            role: LocationAccount::STUDENT,
            location_id: params[:locationId]
          )]
        )

        if user.save
          render json:UserSerializer.new(user,include: UserSerializer::COMMON_INCLUDES)
        else
          error_response(user)
        end
      end
    end

    # Update a child
    patch '/v1/users/:user_id/child/:child_id' do
      child_id = params[:child_id]
      child = User.find(child_id)
      ensure_or_forbidden! { current_user.authorized_to_edit?(child) }

      user_id = params[:user_id]
      user = User.find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_edit?(user) }

      result = child.update(
        first_name: request_json[:first_name],
        last_name: request_json[:last_name],
        needs_physician: request_json[:needs_physician] || false,
        physician_name: request_json[:physician_name],
        physician_phone_number: request_json[:physician_phone_number],
      )

      user = User.find(user_id)

      if result
        render json:UserSerializer.new(user,include: UserSerializer::COMMON_INCLUDES)
      else
        error_response(user)
      end
    end

    # Delete a child
    delete '/v1/users/:user_id/child/:child_id' do
      child_id = params[:child_id]
      child = User.find(child_id)
      ensure_or_forbidden! { current_user.authorized_to_edit?(child) }

      user_id = params[:user_id]
      user = User.find(user_id)
      ensure_or_forbidden! { current_user.authorized_to_edit?(user) }

      result = child.destroy()

      user = User.find(user_id)

      if result
        render json:UserSerializer.new(user,include: UserSerializer::COMMON_INCLUDES)
      else
        error_response(user)
      end
    end
  end
end
