# frozen_string_literal: true
module MailController
  extend ActiveSupport::Concern
  included do
    post '/v1/mail/hello-at-greenlight', auth: false do
      EmailWorker.perform_async(
        params[:from], # from
        'hello@greenlightready.com', # to
        params[:subject], # subject
        params[:body]
      )
    end

    post '/v1/mail/invite', auth: false do
      user = User.find_by_email_or_mobile!(params[:emailOrMobile])
      InviteWorker.perform_async(user.id)
    end
  end
end
