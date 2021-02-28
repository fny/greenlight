# frozen_string_literal: true
module ParentController
  extend ActiveSupport::Concern

  included do
    # Invite another parent
    post '/v1/parent/invite' do
      # Validate if current user has correct children
      request_json[:children].each do |child_id|
        child = User.find(child_id)
        ensure_or_forbidden! { current_user.parent_of?(child) }
      end

      # Check whether the user already exists
      @user = User.find_by_email_or_mobile(request_json[:email_or_mobile])
      is_new = false

      if !@user
        # if user does not exist, create new one
        e_or_m = EmailOrPhone.new(request_json[:email_or_mobile])
        is_new = true

        @user = User.new(
          first_name: request_json[:first_name],
          last_name: request_json[:last_name],
          email: e_or_m.email? ? e_or_m.value : nil,
          mobile_number: e_or_m.phone? ? e_or_m.value : nil,
        )
      end

      @user.children = (@user.children + request_json[:children].map { |child_id|
        User.find(child_id)
      }).uniq

      if @user.save
        if is_new
          # send an email to parent so that they can have access to platform
            InviteWorker.perform_async(@user.id)
        end
        render json: UserSerializer.new(@user)
      else 
        error_response(@user)
      end
    end
  end
end