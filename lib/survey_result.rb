# frozen_string_literal: true
class SurveyResult
  attr_reader :survey, :responses, :result

  def initialize(survey, responses = nil)
    @survey = survey
    @responses = responses || @survey.survey_responses
  end

  def result
    return @result if @result.present?
  
    total_count = responses.count
    total_unanswered = responses.not_answered.count
    total_answered = total_count - total_unanswered

    answer_spread = responses.answered.group(:response).count
    medium_spread = responses.answered.group(:medium).count

    @result = {
      total: total_count,
      responded: total_answered,
      not_responded: total_unanswered,
      responses: answer_spread,
      mediums: medium_spread,
    }
  end

  def result_presentable
    result.merge({
      responses: answers_spread_presentable(result[:responses])
    })
  end

  private

  def answers_spread_presentable(answers_spread)
    choices = survey.choices
    choices.reduce({}) do |legends, (key, label)|
      legends.merge(
        label => answers_spread[key] || 0,
      )
    end
  end
end
