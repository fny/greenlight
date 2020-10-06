class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  # Sort records by date of creation instead of primary key
  # since we use UUIDs
  self.implicit_order_column = :created_at

  def self.last_id
    self.order('id asc').last&.id
  end

  def self.id_seq
    IncreasingSequence.new((self.last_id || 0) + 1)
  end
end
