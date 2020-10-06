module JSONAPI
  module Errors
    class Forbidden < Wrapper
      def initialize(message: nil)
        super(
          title: 'Forbidden request',
          status: 403,
          detail: message || 'You have no rights to access this resource',
        )
      end
    end
  end
end
