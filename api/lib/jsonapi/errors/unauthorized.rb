module JSONAPI
  module Errors
    class Unauthorized < Wrapper
      def initialize(message: nil)
        super(
          title: 'Unauthorized',
          status: 401,
          detail: message || 'You need to login to authorize this request.',
          source: { pointer: { header: 'Authorization' } }
        )
      end
    end
  end
end
