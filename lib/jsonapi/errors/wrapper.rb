# frozen_string_literal: true
module JSONAPI
  module Errors
    class Wrapper
      # From JSON API v1:
      #
      # Error objects MUST be returned as an array keyed by errors in the top level
      # 
      # An error object MAY have the following members:
      #
      # - id: a unique identifier for this particular occurrence of the problem.
      # - links: a links object containing the following members:
      #   - about: a link that leads to further details about this particular occurrence of the problem.
      # - status: the HTTP status code applicable to this problem, expressed as a string value.
      # - code: an application-specific error code, expressed as a string value.
      # - title: a short, human-readable summary of the problem that SHOULD NOT change from occurrence to occurrence of the problem, except for purposes of localization.
      # - detail: a human-readable explanation specific to this occurrence of the problem. Like title, this field’s value can be localized.
      # - source: an object containing references to the source of the error, optionally including any of the following members:
      #   - pointer: a JSON Pointer [RFC6901] to the associated entity in the request document [e.g. "/data" for a primary data object, or "/data/attributes/title" for a specific attribute].
      #   - parameter: a string indicating which URI query parameter caused the error.
      # - meta: a meta object containing non-standard meta-information about the error.
      attr_reader :status, :code, :title, :detail, :source, :backtrace

      def initialize(status: 500, code: nil, title: nil, detail: nil, source: nil, backtrace: nil)
        @status = status.to_s
        @code = code
        @title = title || 'Something went wrong'
        @detail = detail
        @source = source
        @backtrace = backtrace
      end

      def to_h
        hash = {
          status: status,
          code: code,
          title: title,
          detail: detail,
          source: source
        }.compact
        if Rails.env.development? && backtrace
          hash[:backtrace] = backtrace
        end
        hash
      end

      def to_json
        to_h.to_json
      end
    end    
  end
end
