# frozen_string_literal: true
class SurveyScenario
  include Enumerable
  # @param title [String]
  # @param timeline [Hash]
  def initialize(title, timeline)
    @title = title
    @timeline = timeline
  end

  def each(&block)
    @timeline.each(&block)
  end


  class Day
    def initialize(meidcal_events, status)
    end
  end
end
