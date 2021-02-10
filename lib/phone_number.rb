class PhoneNumber
  SUPPORTED_COUNTRY_CODES = [
    :us, # US
    :ca, # Canada
    :pr, # Puerto Rico
    :vi, # US Virgin Islands
    :gu, # Guam
    :as, # American Samoa
    :mp # Northern Mariana Islands
  ].freeze

  # Does it look like the user was trying to type in a number?
  #
  # @return [Boolean]
  def self.looks_like_number?(value)
    value.count('0-9') >= 8
  end

  # @return [String, nil]
  def self.parse(value)
    Phonelib.parse(value, 'US').full_e164
  end

  # @return [Boolean]
  def self.valid?(value)
    num_count = (value || '').count('0-9')
    return false unless num_count == 10 || num_count == 11

    SUPPORTED_COUNTRY_CODES.any? { |code|
      Phonelib.valid_for_country?(value, code)
    }
  end

  def self.equal?(number1, number2)
    self.parse(number1) == self.parse(number2)
  end

  def self.fivefivefive?(number)
    self.parse(number).match?(/\A\+1\d{3}555\d{4}\z/)
  end

  def self.random_number
    number = Faker::PhoneNumber.cell_phone_in_e164[2, 10] until PhoneNumber.valid?(number)
    PhoneNumber.parse(number)
  end
end
