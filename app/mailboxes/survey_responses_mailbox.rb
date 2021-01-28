class SurveyResponsesMailbox < ApplicationMailbox
  # survey sender email format: greenlight+survey+<slug>@greenlight.com
  RECIPIENT_FORMAT = /lucy\+(.+)@greenlight.com/i

  def process
    return unless permalink.present?

    if SurveyParser.content_valid?(content)
      SurveyResponseRegister.new(
        medium: :email,
        response: SurveyParser.clean_content(content),
        from: from_mail,
        permalink: permalink,
      ).run
    end
  end

  def from_mail
    mail.from.first
  end

  def permalink
    # There can be multiple recipients, 
    # so finding the one which matches the RECEIPIENT_FORMAT
    
    recipient = mail.recipients.find { |r| RECIPIENT_FORMAT.match?(r) }
    
    # Returns the first_match and that is product_id
    # For Ex: recipient = "admin+survey+would-you-vaccinate@greenlight.com"
    # Then it'll return "would-you-vaccinate"
    recipient[RECIPIENT_FORMAT, 1]
  end

  def content
    if mail.parts.present?
      mail.parts[0].body.decoded
    else
      mail.decoded
    end
  end
end
