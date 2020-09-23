class PhoneValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless Phonelib.valid_for_country?(value, 'US')
      record.errors[attribute] << (options[:message] || "is not a valid phone number")
    end
  end
end
