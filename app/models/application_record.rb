# frozen_string_literal: true
class ApplicationRecord < ActiveRecord::Base
  class << self
    attr_accessor :permitted_params
  end

  strip_attributes

  self.abstract_class = true

  def self.last_id
    self.order('id asc').last&.id
  end

  def self.id_seq
    IncreasingSequence.new((self.last_id || 0) + 1)
  end

  # @param [Hash] attrs
  def self.restrict_params(attrs)
    HashWithIndifferentAccess.new(attrs).slice(*self.permitted_params)
  end
end
