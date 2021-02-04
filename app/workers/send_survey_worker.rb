# frozen_string_literal: true
class SendSurveyWorker < ApplicationWorker
  def html_template
    Erubi::Engine.new(<<~HTML
      <h2><%= I18n.t('emails.survey.title') %></h2>
      <p>
        <%= I18n.t('emails.survey.salutation', name: user.first_name) %>
      </p>
      <p style="font-weight:bold">
        <%= question %>
      </p>
      <ul>
        <% choices.each do |key, label| %>
          <li><b><%= key %>.</b> <%= label %></li>
        <% end %>
      </ul>
      <p><%= I18n.t('emails.survey.closing') %><br />
      <%= I18n.t('greenlight_team') %>
      </p>
      HTML
    ).src
  end

  def sms_template
    Erubi::Engine.new(<<~SMS
      Greenlight Survey: <%= question %>
      <% choices.each do |key, label| %>
        <%= key %>. <%= label %>
      <% end %>
    SMS
    ).src
  end

  def perform(survey_id, user_id)
    survey = Survey.find(survey_id)
    user = User.find(user_id)
    question = survey.locale_question(user.locale)
    choices = survey.locale_choices(user.locale)
    
    if user.email?
      mailer = SendGridEmail.new(
        to: user.name_with_email,
        from: Greenlight::SURVEY_EMAIL,
        reply_to: SurveyParser.reply_to_email(survey.permalink),
        subject: I18n.t('emails.survey.subject'),
        html: eval(html_template), # rubocop:disable Security/Eval
        text: eval(sms_template), # rubocop:disable Security/Eval
      ).run
    end
    if user.mobile_number?
      PlivoSMS.new(
        to: user.mobile_number,
        from: Greenlight::PHONE_NUMBER,
        message: eval(sms_template) # rubocop:disable Security/Eval
      ).run
    end
  end
end
