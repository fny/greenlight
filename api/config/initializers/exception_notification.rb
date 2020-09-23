if ENV['EXCEPTION_RECIPIENTS']
  Rails.application.config.middleware.use(
    ExceptionNotification::Rack,
    email: {
      deliver_with: :deliver_now,
      email_prefix: '[Greenlight Error] ',
      sender_address: %("Greenlight Errors" <errors@greenlightready.com>),
      exception_recipients: ENV['EXCEPTION_RECIPIENTS'].split(' ')
    }
  )
end
