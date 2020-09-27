class MagicSignInWorker
  include Sidekiq::Worker

  def email_html_template
    Erubi::Engine.new(<<~HTML
      <h2>Use this link to access Greenlight</h2>
      <p>
        You requested a magic link to sign in, and here it is!
        Note that this link expires in 1 hour and can only be used once.
      </p>
      
      <p style="font-weight:bold">
        <a href="<%= user.magic_sign_in_url(remember_me) %>">
          Click Here to Sign In
        </a>
      </p>
      HTML
    ).src 
  end

  def sms_template
    Erubi::Engine.new(<<~SMS
      Greenlight Magic Sign In ✨ <%= user.magic_sign_in_url(remember_me) %>
    SMS
    ).src
  end

  def perform(user_id, email_or_phone, remember_me)
    user = User.find_by!(id: user_id)
    user.reset_magic_sign_in_token!

    if email_or_phone.to_s == 'email'
      SendGridEmail.new(
        to: user.name_with_email,
        subject: "✨ Greenlight Magic Sign In",
        html: eval(email_html_template),
        text: eval(sms_template),
      ).run
    elsif email_or_phone.to_s == 'phone'
      PlivoSMS.new(
        to: '13303332729',
        from: '19013349734',
        message: eval(sms_template)
      ).run
    else 
      raise ArgumentError.new("Got #{email_or_phone} expected 'email' or 'phone'")
    end
  end
end
