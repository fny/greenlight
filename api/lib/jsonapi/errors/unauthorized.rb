module JSONAPI
  module Errors
    class Unauthorized < JSONAPIError
      def initialize(message: nil)
        super(
          title: 'Unauthorized',
          status: 401,
          detail: message || 'You need to login to authorize this request.',
          source: { pointer: '/request/headers/authorization' }
        )
      end
    end
  end
end
