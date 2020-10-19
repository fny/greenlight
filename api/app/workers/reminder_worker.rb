class ReminderWorker < ApplicationWorker
  def html_template
    Erubi::Engine.new(<<~HTML
      <h2>Check In with Greenlight</h2>
      <p>
        Hi <%= user.first_name %>,
      </p>
      <p>
        Just reminding you to send out symptom surveys
        for <%= user.needs_to_sumbit_survey_for %> through Greenlight.
      </p>
      <p style="font-weight:bold">
        <a href="<%= Greenlight::SHORT_URL %>">
          Click Here to Sign In and Submit your Survey
        </a>
      </p>
      <p>Enjoy your day,<br />
      The Greenlight Team
      </p>
      HTML
    ).src
  end

  def sms_template
    Erubi::Engine.new(<<~SMS
    Greenlight reminding you to send out your symptom surveys!
    <%= Greenlight::SHORT_URL %>
    SMS
    ).src
  end

  def perform(user_id)
    user = User.find_by!(id: user_id)
    user.reset_magic_sign_in_token!

    # if user.needs_to_submit_survey_for.empty?
    #   return
    # end
    I18n.with_locale(user.locale) do
      if user.daily_reminder_type.email?
        SendGridEmail.new(
          to: user.name_with_email,
          subject: "🚦 Greenlight Reminder!",
          html: eval(html_template),
          text: eval(sms_template),
        ).run
      end
      if user.daily_reminder_type.text?
        PlivoSMS.new(
          # TODO: Constantize
          to: user.mobile_number,
          from: GreenlightX::PHONE_NUMBER,
          message: eval(sms_template)
        ).run
      end
    end
  end
end
