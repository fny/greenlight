# frozen_string_literal: true
module JSONAPI
  module Errors
    def serialize(errors)
      errors = (errors.is_a?(Array) ? errors : [ errors ]).map(&:to_h)
      {
        errors: errors
      }
    end
    module_function :serialize
  end
end
