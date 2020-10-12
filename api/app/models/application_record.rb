class ApplicationRecord < ActiveRecord::Base
  strip_attributes

  self.abstract_class = true

  def self.last_id
    self.order('id asc').last&.id
  end

  def self.id_seq
    IncreasingSequence.new((self.last_id || 0) + 1)
  end
end
