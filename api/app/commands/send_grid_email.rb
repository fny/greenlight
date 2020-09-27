class SendGridEmail < ApplicationCommand
  # self.client = SendGrid::API.new(api_key: Greenlight::SENDGRID_API_KEY)

  argument :from, default: "Greenlight <no-reply@greenlightready.com>"
  argument :to
  argument :cc
  argument :bcc
  argument :subject
  argument :text
  argument :html

  validates :from, presence: true
  validates :to, presence: true
  validates :subject, presence: true


  def pony_payload
    return @pony_payload if defined?(@pony_payload)
    @pony_payload = {}
    @pony_payload[:from] = self.from
    @pony_payload[:to] =  self.to
    @pony_payload[:cc] = self.cc if self.cc
    @pony_payload[:bcc] = self.bcc if self.bcc
    @pony_payload[:subject] = self.subject
    @pony_payload[:body] = self.text if self.text
    @pony_payload[:html_body] = self.html if self.html

    if Rails.env.production?
      @pony_payload[:via] = :smtp
      @pony_payload[:via_options] = {
        address: 'smtp.sendgrid.net',
        port: '587',
        user_name: 'apikey',
        password: Greenlight::SENDGRID_API_KEY,
        authentication: :plain
      }
    else
      @pony_payload[:via] = :smtp
      @pony_payload[:via_options] = {
        address: 'localhost',
        port: '1025'
      }
    end
    # Letter opener options
    #
    # @pony_payload[:via] =  LetterOpener::DeliveryMethod,
    # @pony_payload[:via_options] = {
    #   :location => File.expand_path('../tmp/letter_opener', __FILE__)
    # }
    @pony_payload
  end

  def work
    Pony.mail(pony_payload)
  end
end
