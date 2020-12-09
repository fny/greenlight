# frozen_string_literal: true
class LARemovalAlertUserWorker < ApplicationWorker
  def html_template
    Erubi::Engine.new(<<~HTML
      <h2>
        <%= I18n.t(
          'emails.la_removal_alert.title',
          location: location.name,
        ) %>
      </h2>
      <p>
        <%= I18n.t('emails.la_removal_alert.salutation', name: user.first_name) %>
      </p>
      <p>
        <%= I18n.t(
          'emails.la_removal_alert.body',
          user: leaving_user.full_name,
          location: location.name,
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
        'texts.la_removal_alert',
        user: leaving_user.full_name,
        location: location.name,
      ) %>
    SMS
    ).src
  end

  def perform(user_id, location_id, leaving_user_id)
    user = User.find(user_id)
    location = Location.find(location_id)
    leaving_user = User.find(leaving_user_id)

    I18n.with_locale(user.locale) do
      SendGridEmail.new(
        to: user.name_with_email,
        subject: I18n.t('emails.la_removal_alert.subject'),
        html: eval(html_template),
        text: eval(text_template),
      ).run
    end
  end
end
