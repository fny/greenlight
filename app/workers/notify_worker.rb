# frozen_string_literal: true
class NotifyWorker < ApplicationWorker
  def html_template
    Erubi::Engine.new(<<~HTML
      <h2><%= I18n.t('emails.notify.title', color: status_color) %></h2>
      <p>
        <%= I18n.t('emails.notify.salutation', name: user.first_name) %>
      </p>
      <p>
        <%= I18n.t('emails.notify.body', user: symptom_holder.full_name, status: status) %>
      </p>
      <%= I18n.t('greenlight_team') %>
      </p>
      HTML
    ).src
  end

  def text_template
    Erubi::Engine.new(<<~SMS
      <%= symptom_holder.full_name %> submitted a '<%= status %>' status.
    SMS
    ).src
  end

  def perform(user_id, symptom_holder_id, status)
    user = User.find(user_id)
    symptom_holder = User.find(symptom_holder_id)
    status_color = status == 'pending' ? 'Yellow' : 'Red'

    I18n.with_locale(user.locale) do
      SendGridEmail.new(
        to: user.name_with_email,
        subject: I18n.t('emails.notify.subject'),
        html: eval(html_template),
        text: eval(text_template),
      )
    end
  end
end
