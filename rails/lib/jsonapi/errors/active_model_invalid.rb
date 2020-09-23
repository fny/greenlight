module JSONAPI
  module Errors
    class ActiveModelInvalid < JSONAPIError
      def initialize(errors: {})
        @errors = errors
        @status = 422
        @title = 'Invalid request'
      end

      def to_h
        errors.reduce([]) do |r, (att, msg)|
          r << {
            status: status,
            title: title,
            detail: msg,
            source: { pointer: "/data/attributes/#{att}" }
          }
        end
      end

      private

      attr_reader :errors
    end
  end
end
