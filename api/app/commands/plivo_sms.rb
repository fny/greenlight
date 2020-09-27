class PlivoSMS < ApplicationCommand
  argument :from, default: '919-728-5377'
  argument :to
  argument :message

  validates :from, presence: true, phone: true
  validates :to, presence: true, phone: true

  def work
    client = Plivo::RestClient.new
    if !Rails.env.production?
      to = '330-333-2729'
    end
    response = client.messages.create(
      Phonelib.parse(from, 'US').full_e164,
      [Phonelib.parse(to, 'US').full_e164],
      message
    )
    response
  end
end
