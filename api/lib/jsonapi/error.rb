# frozen_string_literal: true
module JSONAPI
  class Error < StandardError
    attr_reader :status, :code, :title, :detail, :source
    def initialize(
      status: 500,
      code: nil,
      title: 'Something went wrong',
      detail: nil,
      source: nil
    )
      @status = status
      @code = code
      @title = title
      @detail = detail
      @source = source
      msg = title
      super
    end

    def to_h
      hash = {
        status: status,
        code: code,
        title: title,
        detail: detail,
        source: source,
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
