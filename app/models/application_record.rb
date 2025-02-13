# frozen_string_literal: true
class ApplicationRecord < ActiveRecord::Base
  include PluckToHash

  class << self
    # @return [Array<Symbol>]
    attr_accessor :permitted_params
    # @return [Array<Symbol>]
    attr_accessor :queryable_columns
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
  def self.restrict_params(attrs, additional = [])
    hash = HashWithIndifferentAccess.new(attrs).slice(*self.permitted_params)
    additional.each do |key|
      hash[key] = attrs[key]
    end
    hash
  end

  # @param [Array<String>] columns
  # @param [String] query
  # @return [ActiveRecord::Relation]
  def self.search(columns, query)
    return all if query.blank?

    where(
      columns.map { |col| "lower(#{col}) LIKE :query"}.join(' OR '),
      query: "%#{query.downcase.sub(' ', '%')}%"
    )
  end

  # @param [String] query
  # @return [ActiveRecord::Relation]
  def self.q(query)
    return all if query.blank?

    self.search(queryable_columns || [], query)
  end

  # @param [String] query
  # @return [ActiveRecord::Base, nil]
  def self.qf(query)
    return all if query.blank?

    self.search(queryable_columns || [], query).first
  end

  def self.dedupe(columns)
    duplicate_row_values = select("#{columns.join(', ')}, count(*)")
      .group(columns.join(', '))
      .having('count(*) > 1')
      .pluck_to_hash(*columns)

    duplicate_row_values.each do |query|
      where(query).order(id: :desc)[1..].map(&:destroy)
    end
  end
end
