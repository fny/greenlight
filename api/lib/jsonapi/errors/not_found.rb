module JSONAPI
  module Errors
    class NotFound < JSONAPIError
      def initialize(message: nil)
        super(
          title: 'Record not Found',
          status: 404,
          detail: message || 'We could not find the object you were looking for.',
        )
      end
    end
  end
end
