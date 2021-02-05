# frozen_string_literal: true
class EmailOrPhone
  def initialize(value)
    @value = value ? value.strip.downcase : ''
  end

  def value
    if phone?
      PhoneNumber.parse(@value)
    else
      @value
    end
  end

  def valid?
    email? || PhoneNumber.valid?(@value)
  end

  def invalid?
    !valid?
  end

  def email?
    @value.include?('@')
  end

  def phone?
    PhoneNumber.looks_like_number?(@value)
  end
end
