class ReminderWorker < ApplicationWorker
  def html_template
    Erubi::Engine.new(<<~HTML
      <h2><%= I18n.t('emails.reminder.title') %></h2>
      <p>
        <%= I18n.t('emails.reminder.salutation', name: user.first_name) %>
      </p>
      <p>
        <%= I18n.t('emails.reminder.body', users: user.needs_to_submit_survey_for) %>
      </p>
      <p style="font-weight:bold">
        <a href="<%= Greenlight::SHORT_URL %>">
          <%= I18n.t('emails.reminder.action') %>
        </a>
      </p>
      <p><%= I18n.t('emails.reminder.closing') %><br />
      <%= I18n.t('greenlight_team') %>
      </p>
      HTML
    ).src
  end

  def sms_template
    Erubi::Engine.new(<<~SMS
    <%= I18n.t('texts.reminder') %>
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
          subject: I18n.t('emails.reminders.subject'),
          html: eval(html_template),
          text: eval(sms_template),
        ).run
      end
      if user.daily_reminder_type.text?
        PlivoSMS.new(
          # TODO: Constantize
          to: user.mobile_number,
          from: Greenlight::PHONE_NUMBER,
          message: eval(sms_template)
        ).run
      end
    end
  end
end
