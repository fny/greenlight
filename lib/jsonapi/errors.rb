# frozen_string_literal: true
module JSONAPI
  module Errors
    def serialize(errors)
      case errors
      when JSONAPI::Errors::ActiveModelInvalid
        { errors: errors.to_h }
      when Array
        { errors: errors.map(&:to_h) }
      else
        { errors: [ errors.to_h ] }
      end
    end
    module_function :serialize
  end
end
