# frozen_string_literal: true
class PlivoSMS < ApplicationCommand
  MESSAGE_LIMIT_ASCII = 160
  MESSAGE_LIMIT_UNICODE = 70

  # Raised when the message length exceeds the cut-off limit
  TextTooLongError = Class.new(RuntimeError)

  argument :from, default: Greenlight::PHONE_NUMBER
  argument :to
  argument :message

  validates :from, presence: true, phone: true
  validates :to, presence: true
  validates :message, presence: true

  validate :valid_to


  def valid_to
    unless to && to.split(',').all? { |p| PhoneNumber.valid?(p) }
      errors.add(:to, "invalid phone number")
    end
  end


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
    ensure_message_in_range!
    if multiple_numbers?
      send_multiple
    else
      send_one
    end
  end

  def send_one
    return if PhoneNumber.fivefivefive?(to)
    if Rails.env.production?
      PlivoSMS.client.messages.create(
        PhoneNumber.parse(from),
        [PhoneNumber.parse(to)],
        message
      )
    else
      PlivoSMS.test_deliver(from: from, to: to, message: message)
    end
  end

  def send_multiple
    nums = Set.new(to.split(','))
    if Rails.env.production?
      PlivoSMS.client.messages.create(
        PhoneNumber.parse(from),
        [nums.map { |num| PhoneNumber.parse(num) }],
        message
      )
    else
      PlivoSMS.test_deliver(from: from, to: to, message: message)
    end
  end

  def multiple_numbers?
    to.include?(',')
  end

  private

  def ensure_message_in_range!
    without_unicode = message.encode('ASCII', 'UTF-8',
      invalid: :replace,
      undef: :replace,
      replace: ''
    )
    has_unicode = without_unicode.length != message.length
    message_limit = has_unicode ? MESSAGE_LIMIT_UNICODE : MESSAGE_LIMIT_ASCII

    if message.length > message_limit
      raise TextTooLongError.new(
        "Text is #{message.length} characters maximum is #{message_limit}: #{message}"
      )
    end
  end
end
