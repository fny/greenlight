class MailgunEmail < ApplicationCommand
  argument :from, default: "Greenlight <notify@#{Greenlight::MAILGUN_DOMAIN}>"
  argument :to
  argument :cc
  argument :bcc
  argument :subject
  argument :text
  argument :html
  argument :tag
  argument :deliver_at, type: :datetime
  argument :test_mode, type: :boolean, default: false

  validates :from, presence: true
  validates :to, presence: true
  validates :subject, presence: true

  def mailgun_endpont
    "https://api:#{Greenlight::MAILGUN_API_KEY}@api.mailgun.net/v3/#{Greenlight::MAILGUN_DOMAIN}/messages"
  end

  def mailgun_payload
    return @mg_payload if defined?(@mg_payload)
    @mg_payload = {}
    @mg_payload['from'] = self.from
    @mg_payload['to'] = self.to
    @mg_payload['cc'] = self.cc if self.cc
    @mg_payload['bcc'] = self.bcc if self.bcc
    @mg_payload['subject'] = self.subject
    @mg_payload['text'] = self.text if self.text
    @mg_payload['html'] = self.html if self.html
    @mg_payload['o:tag'] = self.tag if self.tag
    @mg_payload['o:deliverytime'] = self.deliver_at.rfc2822 if self.deliver_at
    @mg_payload['o:testmode'] = self.test_mode
    @mg_payload
  end

  def pony_payload
    return @pony_payload if defined?(@pony_payload)
    @pony_payload = {}
    @pony_payload[:from] = self.from
    @pony_payload[:to] = self.to
    @pony_payload[:cc] = self.cc if self.cc
    @pony_payload[:bcc] = self.bcc if self.bcc
    @pony_payload[:subject] = self.subject
    @pony_payload[:body] = self.text if self.text
    @pony_payload[:html_body] = self.html if self.html
    @pony_payload[:via_options] = {
      address: 'smtp.mailgun.org',
      port: '587',
      user_name: Greenlight::MAILGUN_SMTP_USERNAME,
      password: Greenlight::MAILGUN_SMTP_PASSWORD,
      authentication: :plain,
      domain: Greenlight::API_URI.host
    }
    @pony_payload
  end
  
  def api_send
    response = Faraday.post(mailgun_endpont, payload)
    if response.status == 401
      fail!(:base, :mailgun_unauthorized)
    end
    if response.status != 200
      fail!(:base, :mailgun_error)
    end
    response
  end

  def smtp_send
    Pony.mail(pony_payload)
  end

  def work
    api_send
  end
end
