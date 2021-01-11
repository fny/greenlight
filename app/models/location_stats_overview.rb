# frozen_string_literal: true
class LocationStatsOverview
  def initialize(location, date)
    @location = location
    @date = begin
      Date.parse(date)
    rescue
      Date.current
    end
  end

  def id
    "#{@location.id}@#{@date}"
  end

  def status_breakdown(date = nil)
    start_date = (date - 6.days).to_date
    total_users = @location.users.count
    summary = GreenlightStatus.where(user: @location.users)
      .where('submission_date >= ?', start_date)
      .group(:submission_date, :status)
      .count
      # .pluck_to_hash(:submission_date, :status, 'count(1) as count', 'max(created_at) as created_at', 'max(updated_at) as updated_at')

    result = {}
    summary.each do |k, v|
      date, state = k
      result[date] ||= {}
      result[date][state] = v
    end
    result.each do |k, v|
      result[k]['unknown'] = total_users - v.values.sum
    end
    result
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
end
