# frozen_string_literal: true
class StatusAlertUserWorker < ApplicationWorker
  def html_template
    Erubi::Engine.new(<<~HTML
      <h2><%= I18n.t('emails.status_alert.title', status_color: status_color) %></h2>
      <p>
        <%= I18n.t('emails.status_alert.salutation', name: user.first_name) %>
      </p>
      <p>
        <%= I18n.t(
          'emails.status_alert.body',
          user: symptom_holder.full_name,
          status_color: status_color,
        ) %>
      </p>
      <%= I18n.t('greenlight_team') %>
      </p>
      HTML
    ).src
  end

  def text_template
    Erubi::Engine.new(<<~SMS
      <%= I18n.t(
        'texts.status_alert.text',
        user: symptom_holder.full_name,
        status_color: status_color,
      ) %>
    SMS
    ).src
  end

  def perform(user_id, symptom_holder_id, status)
    user = User.find(user_id)
    symptom_holder = User.find(symptom_holder_id)
    status_color = I18n.t("greenlight_status.#{status}") +
      ' (' + I18n.t("greenlight_status.colors.#{status}") + ')'

    I18n.with_locale(user.locale) do
      SendGridEmail.new(
        to: user.name_with_email,
        subject: I18n.t('emails.status_alert.subject'),
        html: eval(html_template),
        text: eval(text_template),
      ).run
    end
  end
end
