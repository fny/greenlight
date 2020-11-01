# frozen_string_literal: true
# Represents a point where
class CutoffTime
  include Comparable

  attr_reader :hour, :min

  # @param cutoff [Time, #seconds_since_midnight]
  def initialize(cutoff)
    @cutoff = cutoff
    @hour = cutoff.hour
    @min = cutoff.min
  end

  # @param other [Time]
  def <=>(other)
    return -1 if @cutoff.seconds_since_midnight < other.seconds_since_midnight
    return 1  if @cutoff.seconds_since_midnight > other.seconds_since_midnight

    0
  end

  # @param other [Time]
  #
  # @returns [Date]
  def round(other)
    if self <= other
      (other.change({ hour: 0, min: 0, sec: 0 }) + 1.day).to_date
    else
      other.change({ hour: 0, min: 0, sec: 0 }).to_date
    end
  end

  def to_time_with_zone
    Time.zone.now.change({ hour: hour, min: min, sec: 0 })
  end
end
