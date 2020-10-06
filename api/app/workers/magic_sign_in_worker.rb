class MagicSignInWorker < ApplicationWorker
  def html_template
    Erubi::Engine.new(<<~HTML
      <h2>#{I18n.t('emails.magic_sign_in.title')}</h2>
      <p>
        #{I18n.t('emails.magic_sign_in.body')}
      </p>

      <p style="font-weight:bold">
        <a href="<%= user.magic_sign_in_url(remember_me) %>">
        #{I18n.t('emails.magic_sign_in.action')}
        </a>
      </p>
      HTML
    ).src
  end

  def perform(user_id, email_or_phone, remember_me)
    user = User.find_by!(id: user_id)
    user.reset_magic_sign_in_token!
    I18n.with_locale(user.locale) do
      if email_or_phone.to_s == 'email'
        SendGridEmail.new(
          to: user.name_with_email,
          subject: I18n.t('emails.magic_sign_in.subject'),
          html: eval(html_template),
          text: I18n.t('texts.magic_sign_in', link: user.magic_sign_in_url(remember_me)),
        ).run
      elsif email_or_phone.to_s == 'phone'
        PlivoSMS.new(
          to: user.mobile_number,
          # TODO: Constantize
          from: GreenlightX::PHONE_NUMBER,
          message: I18n.t('texts.magic_sign_in', link: user.magic_sign_in_url(remember_me))
        ).run
      else
        raise ArgumentError.new("Got #{email_or_phone} expected 'email' or 'phone'")
      end
    end
  end
end
