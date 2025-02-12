# frozen_string_literal: true
module MailController
  extend ActiveSupport::Concern
  included do
    post '/v1/mail/hello-at-greenlight', auth: false do
      EmailWorker.perform_async(
        'hello@greenlightready.com', # from
        'hello@greenlightready.com', # to
        params[:subject], # subject
        params[:body] # body
      )

      success_response
    end

    post '/v1/mail/invite', auth: false do
      user = User.find_by_email_or_mobile!(params[:emailOrMobile])
      InviteWorker.perform_async(user.id)
    end
  end
end
