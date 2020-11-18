# frozen_string_literal: true
class ApplicationRecord < ActiveRecord::Base
  class << self
    # @return [Array<Symbol>]
    attr_accessor :permitted_params
  end

  # From strip_attributes gem. Automatically strips all attributes of leading
  # and trailing whitespace before validation. If the attribute is blank, it
  # strips the value to nil by default.
  strip_attributes

  self.abstract_class = true

  # Returns the last id in the database
  # @return [Integer, nil]
  def self.last_id
    order('id DESC').limit(1).pick(:id)
  end

  # Returns a sequence generator starting for the next valid id
  # @return [IncreasingSequence]
  def self.id_seq
    IncreasingSequence.new((self.last_id || 0) + 1)
  end

  # Returns a subset of the params provided for the given model according to any
  # permitted params that have defined for that model.
  #
  # @param [Hash] attrs
  # @return [HashWithIndifferentAccess]
  def self.restrict_params(attrs)
    HashWithIndifferentAccess.new(attrs).slice(*self.permitted_params)
  end
end
