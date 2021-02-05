# frozen_string_literal: true

module JSONAPI
  module Errors
    class ActiveModelInvalid < Wrapper
      # @return [ActiveModel::Errors]
      attr_reader :errors

      # @param [ActiveModel::Errors] errors
      def initialize(errors: ActiveModel::Errors.new) # rubocop:disable Lint/MissingSuper
        @errors = errors
        @status = 422
        @title = 'Invalid request'
      end

      def to_h
        errors.reduce([]) do |r, error|
          r << {
            status: status,
            title: title,
            detail: errors.full_message(error.attribute, error.message),
            source: { pointer: "/data/attributes/#{error.attribute}" }
          }
        end
      end
    end
  end
end
