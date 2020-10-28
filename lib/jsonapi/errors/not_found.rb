# frozen_string_literal: true
module JSONAPI
  module Errors
    class NotFound < Wrapper
      def initialize(detail: nil, title: nil)
        super(
          title: title || 'Record not Found',
          status: 404,
          detail: detail || 'We could not find the object you were looking for.',
        )
      end
    end
  end
end
