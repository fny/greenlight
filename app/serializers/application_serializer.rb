# frozen_string_literal: true
class ApplicationSerializer
  include JSONAPI::Serializer
  # cache_options store: Rails.cache, namespace: 'jsonapi', expires_in: 1.hour

  set_key_transform :camel_lower
  attributes :created_at, :updated_at
end
