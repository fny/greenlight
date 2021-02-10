# frozen_string_literal: true

#
# Use this worker to send reminders to users at any time of the day. Note this
# worker will only ignore users who who have reminders disabled.
#
# This will send reminders to users who have not completed the registration
# process.
#
# This should generally not be called directly but instead through a scheduling
# mechanism.
#
class ReminderWorker < ApplicationWorker
  sidekiq_options retry: 0

  REMINDER_DAYS = %i[
    remind_sun remind_mon remind_tue remind_wed remind_thu remind_fri remind_sat
  ].freeze

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

    # Don't send reminders twice in the same day
    return if user.reminder_send_today?

    # Don't send if ther user has reminders disabled
    return unless user.remind?

    user.update_columns(daily_reminder_sent_at: Time.now)

    I18n.with_locale(user.locale) do
      if user.remind_by_text?
        PlivoSMS.new(
          to: user.mobile_number,
          from: Greenlight::PHONE_NUMBER,
          message: eval(sms_template)
        ).run
      elsif user.remind_by_email?
        SendGridEmail.new(
          to: user.name_with_email,
          subject: I18n.t('emails.reminder.subject'),
          html: eval(html_template),
          text: eval(sms_template),
        ).run
      end
    end
  end
end
