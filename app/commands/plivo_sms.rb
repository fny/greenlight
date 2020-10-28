# frozen_string_literal: true
class PlivoSMS < ApplicationCommand
  argument :from, default: Greenlight::PHONE_NUMBER
  argument :to
  argument :message

  validates :from, presence: true, phone: true
  validates :to, presence: true, phone: true

  def self.deliveries
    @deliveries ||= []
  end

  def self.test_deliver(from:, to:, message:)
    logger.info("#{from} -> #{to}: #{message}")
    self.deliveries << { from: from, to: to, message: message }
  end

  def self.client
    return @client if defined?(@client)
    @client = Plivo::RestClient.new
  end

  def logger
    @logger ||= Logger.new(Rails.root.join('log', 'sms.log'))
  end

  def work
    if Rails.env.production?
      PlivoSMS.client.messages.create(
        Phonelib.parse(from, 'US').full_e164,
        [Phonelib.parse(to, 'US').full_e164],
        message
      )
    else
      PlivoSMS.test_deliver(from: from, to: to, message: message)
    end
  end
end
