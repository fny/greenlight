module JSONAPI
  module Errors
    class RateLimitExceeded < JSONAPIError
      def initialize(message: nil)
        super(
          title: 'Rate Limit Exceeded',
          code: 'enhance_your_calm',
          status: 420
        )
      end
    end
  end
end
