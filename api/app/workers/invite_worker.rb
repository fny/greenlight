class InviteWorker < ApplicationWorker
  def html_template
    # TODO: Generalize
    Erubi::Engine.new(<<~HTML
      <h2>Welcome to Greenlight</h2>
      <p>
        Hi <%= user.first_name %>,
      </p>
      <p>
        We're working with W.G. Pearson Center to create
        a safe and health space for learning and teachers, and
        we need your help too!
      </p>
      <p>
        Every day, you will be submitting symptom surveys
        for <%= user.submits_surveys_for_text %> through Greenlight.
      </p>
      <p style="font-weight:bold">
        <a href="<%= user.magic_sign_in_url(false) %>">
          Click Here to Sign In and Review Your Account
        </a>
      </p>
      <p>Thanks for your help, and let us know if you have questions.</p>
      <p>Stay safe out there,<br />
      The Greenlight Team
      </p>
      HTML
    ).src 
  end

  def sms_template
    # TODO: Generalize
    Erubi::Engine.new(<<~SMS
      <% if user.invited_at %>REMINDER! <% end %>W.G. Pearson Center has registered you for Greenlight daily monitoring.
      Sign up here: <%= user.magic_sign_in_url(false) %>
    SMS
    ).src
  end

  def perform(user_id)
    user = User.find_by!(id: user_id)
    user.reset_magic_sign_in_token!
    I18n.with_locale(user.locale) do
      if user.email?
        SendGridEmail.new(
          to: user.name_with_email,
          subject: user.invited_at.blank? ? "✨ Welcome to Greenlight!" : '✨ REMINDER: Welcome to Greenlight!',
          html: eval(html_template),
          text: eval(sms_template),
        ).run
      end
      if user.mobile_number?
        PlivoSMS.new(
          to: user.mobile_number,
          from: GreenlightX::PHONE_NUMBER,
          message: eval(sms_template)
        ).run
      end
    end

    if user.invited_at.blank?
      user.invited_at = Time.now
      user.save!
    end
  end
end
