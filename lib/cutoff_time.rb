# frozen_string_literal: true
# Represents a point where
class CutoffTime
  include Comparable

  # @param cutoff [Time, #seconds_since_midnight]
  def initialize(cutoff)
    @cutoff = cutoff
  end

  # @param other [Time]
  def <=>(other)
    if @cutoff.seconds_since_midnight < other.seconds_since_midnight
      return -1
    end
    if @cutoff.seconds_since_midnight > other.seconds_since_midnight
      return 1
    end
    return 0
  end

  # @param other [Time]
  def round(other)
    if self <= other
      other.change({  hour: 0, min: 0, sec: 0 }) + 1.day
    else
      other.change({ hour: 0, min: 0, sec: 0 })
    end
  end
end
