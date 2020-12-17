# frozen_string_literal: true
class ReminderWorker < ApplicationWorker
  sidekiq_options retry: 0

  def html_template
    Erubi::Engine.new(<<~HTML
      <h2><%= I18n.t('emails.reminder.title') %></h2>
      <p>
        <%= I18n.t('emails.reminder.salutation', name: user.first_name) %>
      </p>
      <p>
        <%= I18n.t('emails.reminder.body') %>
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
    user = User.find(user_id)
    if user.daily_reminder_sent_at&.today?
      return
    end

    if user.inferred_status.status != GreenlightStatus::UNKNOWN
      return
    end

    user.update_columns(daily_reminder_sent_at: Time.now)

    I18n.with_locale(user.locale) do
      if user.daily_reminder_type.email?
        SendGridEmail.new(
          to: user.name_with_email,
          subject: I18n.t('emails.reminder.subject'),
          html: eval(html_template),
          text: eval(sms_template),
        ).run
      end
      if user.daily_reminder_type.text?
        PlivoSMS.new(
          to: user.mobile_number,
          from: Greenlight::PHONE_NUMBER,
          message: eval(sms_template)
        ).run
      end
    end
  end
end
