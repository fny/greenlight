# frozen_string_literal: true
class LocationStatsOverview
  #
  # Returns interesting statistics for a location
  #
  # @param [Location] location to analyze
  # @param [Date] date from which to look back
  #
  def initialize(location, date)
    @location = location
    @date = begin
      Date.parse(date)
    rescue
      Date.current
    end
  end

  #
  # @return [String] uniuqe id for this report
  #
  def id
    "#{@location.id}@#{@date}"
  end

  def created_at
    Time.now
  end

  def updated_at
    Time.now
  end

  def weekly_status_summary
    status_breakdown(@date)
  end

  #
  # <Description>
  #
  # @param [Date] date the start date
  #
  # @return [Hash] { date => { status => count } }
  #
  def status_breakdown(date = nil)
    start_date = (date - 6.days).to_date
    total_users = @location.users.count
    summary = GreenlightStatus.where(user: @location.users)
      .where('submission_date >= ?', start_date)
      .group(:submission_date, :expiration_date, :status)
      .count
      # .pluck_to_hash(:submission_date, :status, 'count(1) as count', 'max(created_at) as created_at', 'max(updated_at) as updated_at')

    # result = {}
    # (start_date..date).each do |d|
    #   summary.each do |k, v|
    #     start, expiry, status = k
    #     result[d] ||= {}
    #     result[d][status] ||= 0
    #     result[d][status] += v if d >= start && d < expiry
    #   end
    # end

    result.each do |k, v|
      result[k]['unknown'] = total_users - v.values.sum
    end
    result
  end
end
