# frozen_string_literal: true
class ApplicationSerializer
  include FastJsonapi::ObjectSerializer
  set_key_transform :camel_lower
  attributes :created_at, :updated_at
end
