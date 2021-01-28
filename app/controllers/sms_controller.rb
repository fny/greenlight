# frozen_string_literal: true

module SMSController
  extend ActiveSupport::Concern

  #
  # {"From"=>"19199993085", "MessageIntent"=>"", "MessageUUID"=>"18db7417-5f38-11eb-8b58-0242ac110008", "PowerpackUUID"=>"", "Text"=>"Survey-5", "To"=>"19197285377", "TotalAmount"=>"0", "TotalRate"=>"0", "Type"=>"sms", "Units"=>"1", "auth"=>false}
  #

  included do
    post '/v1/sms', auth: false do
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
