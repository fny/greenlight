# frozen_string_literal: true
class EmailOrPhone
  def initialize(value)
    @value = value.strip.downcase
  end

  def value
    if phone?
      Phonelib.parse(@value, 'US').full_e164
    else
      @value
    end
  end

  def invalid?
    !email? && !phone?
  end

  def email?
    @value.include?('@')
  end

  def phone?
    Phonelib.valid_for_country?(@value, 'US')
  end
end
