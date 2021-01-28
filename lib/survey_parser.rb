# frozen_string_literal: true

module SurveyParser
  def self.clean_content(content)
    content.strip
  end

  def self.content_valid?(content)
    clean_content = self.clean_content(content)
    integer_form = clean_content.to_i

    "#{integer_form.abs}" == clean_content
  rescue => _
    false
  end

  def self.reply_to_email(survey_permalink)
    Greenlight::SURVEY_EMAIL.gsub('@', "+#{survey_permalink}@")
  end
end
