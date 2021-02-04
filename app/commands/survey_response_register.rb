# frozen_literal_string: true

class SurveyResponseRegister < ApplicationCommand
  argument :medium
  argument :response
  argument :from
  argument :permalink

  def work
    return false if respondant.nil?
    return false if survey.nil?
    return false unless survey.valid_response? response

    survey_response = respondant.survey_responses.
      not_answered.find_by(survey: survey)
    return false if survey_response.nil?

    survey_response.update(response: response, medium: medium, responded_at: DateTime.now)
  end

  private

  def respondant
    @respondant ||= User.find_by_email_or_mobile(from)
  end

  def survey
    return @survey if @survey.present?

    @survey = medium == :email ?
      Survey.find_by_permalink(permalink) :
      last_sent_survey(respondant)
  end

  def last_sent_survey(respondant)
    last_survey = respondant.survey_responses.
      not_answered.order(created_at: :desc).first
    return nil if last_survey.nil?

    last_survey.survey
  end
end
