# frozen_string_literal: true
module InboundsController
  extend ActiveSupport::Concern

  included do
    post '/v1/inbounds/email', auth: false do
      survey_permalink = SurveyParser.permalink_from_email(params[:to])
      content = params[:text]
      from_mail = params[:from]

      if survey_permalink.present? && SurveyParser.content_valid?(content)
        SurveyResponseRegister.new(
          medium: :email,
          response: SurveyParser.clean_content(content),
          from: from_mail,
          permalink: permalink,
        ).run
      end

      success_response
    end

    #
    # {"From"=>"19199993085",
    #  "MessageIntent"=>"",
    #  "MessageUUID"=>"18db7417-5f38-11eb-8b58-0242ac110008",
    #  "PowerpackUUID"=>"",
    #  "Text"=>"Survey-5",
    #  "To"=>"19197285377",
    #  "TotalAmount"=>"0",
    #  "TotalRate"=>"0",
    #  "Type"=>"sms",
    #  "Units"=>"1"}
    #
    post '/v1/inbounds/sms', auth: false do
      text = params['Text']
      from = params['From']

      if SurveyParser.content_valid?(text)
        SurveyResponseRegister.new(
          medium: :phone,
          response: SurveyParser.clean_content(text),
          from: from,
        ).run
      end

      success_response
    end
  end
end
