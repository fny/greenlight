# frozen_string_literal: true
module MailController
  extend ActiveSupport::Concern
  included do
    post '/v1/mail/hello-at-greenlight' do
      EmailWorker.perform_async(
        params[:from], # from
        'hello@greenlightready.com', # to
        params[:subject], # subject
        params[:body]
      )
    end

    post '/v1/mail/invite' do
      user = User.find_by_email_or_mobile!(params[:emailOrMobile])
      if user.completed_welcome_at
        head :not_found
      else
        InviteWorker.perform_async(user.id)
        success_response
      end
    end
  end
end
