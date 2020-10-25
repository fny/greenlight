class PlivoSMS < ApplicationCommand
  def self.deliveries
    @@deliveries ||= []
  end

  def logger
    @@logger ||= Logger.new("#{Rails.root}/log/sms.log")
  end

  argument :from, default: Greenlight::PHONE_NUMBER
  argument :to
  argument :message

  validates :from, presence: true, phone: true
  validates :to, presence: true, phone: true

  def work
    client = Plivo::RestClient.new
    if Rails.env.production?
      response = client.messages.create(
        Phonelib.parse(from, 'US').full_e164,
        [Phonelib.parse(to, 'US').full_e164],
        message
      )
      response
    else
      PlivoSMS.deliveries << { from: from, to: to, message: message }
      logger.info("#{from} -> #{to}: #{message}")
    end
  end
end
