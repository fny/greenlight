# frozen_string_literal: true

module SurveyParser
  SURVEY_REPLY_TO_PATTERN = /survey\+(.+)@mailbox.greenlightready.com/i
  SURVEY_REPLY_TO_EMAIL_ORIGIN = 'survey@mailbox.greenlightready.com'.freeze

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
    SURVEY_REPLY_TO_EMAIL_ORIGIN.gsub('@', "+#{survey_permalink}@")
  end

  def self.permalink_from_email(email)
    email[SURVEY_REPLY_TO_PATTERN, 1]
  end
end
