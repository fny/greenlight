# frozen_string_literal: true
class PasswordResetWorker < ApplicationWorker
  def perform(user_id, email_or_phone)
    user = User.find_by!(id: user_id)

    I18n.with_locale(user.locale) do
      if email_or_phone.to_s == 'email'
        send_email(user)
      elsif email_or_phone.to_s == 'phone'
        send_sms(user)
      else
        raise ArgumentError, "Got #{email_or_phone} expected 'email' or 'phone'"
      end
    end
  end

  private

  def html_template
    Erubi::Engine.new(<<~HTML).src
      <h2>#{I18n.t('emails.password_reset.title')}</h2>
      <p>
        #{I18n.t('emails.password_reset.body')}
      </p>

      <p style="font-weight:bold">
        <a href="<%= user.password_reset_url %>">
        #{I18n.t('emails.password_reset.action')}
        </a>
      </p>
    HTML
  end

  def send_email(user)
    SendGridEmail.new(
      to: user.name_with_email,
      subject: I18n.t('emails.password_reset.subject'),
      html: eval(html_template),
      text: I18n.t('texts.password_reset', link: user.password_reset_url),
    ).run
  end

  def send_sms(user)
    PlivoSMS.new(
      to: user.mobile_number,
      from: Greenlight::PHONE_NUMBER,
      message: I18n.t('texts.password_reset', link: user.password_reset_url),
    ).run
  end
end
