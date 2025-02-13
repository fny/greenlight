# frozen_string_literal: true
class LocationStatsOverview
  MAX_QUARANTINE_DAYS = 14

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
    status_breakdown_stateful(@date)
  end

  def status_breakdown_v2(date = nil)
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

  def status_breakdown_stateful(date = nil)
    start_date = (date - 6.days).to_date
    querying_start_date = start_date - MAX_QUARANTINE_DAYS.days
    total_users = @location.users.count

    # {[user_id, submission_date] => [{ status, expiration_date, ... }](last elem is the last submission of the day) }
    all_user_statuses = GreenlightStatus.where(user: @location.users)
                                        .where(submission_date: querying_start_date..date)
                                        .order(:user_id, submission_date: :desc, created_at: :asc, id: :asc)
                                        .select('user_id, status, submission_date, expiration_date')
                                        .group_by { |status| [status.user_id, status.submission_date] }

    date_range = Array(start_date..date)
    result = date_range.reduce({}) do |result_hash, d|
      result_hash.merge({
        d => {},
      })
    end

    # {user_id => [submission_dates](dates ordered in desc)}
    # rids of the unnecessary submission dates on user basis
    # i.e. for Jan 1 ~ Jan 7 range, if Dec 31 has a submission, then older submissions are not needed in calculation
    user_dates = {}
    picked_past_date_for_user = {}
    all_user_statuses.keys.each do |user_id, submission_date|
      user_dates[user_id] ||= []

      next if picked_past_date_for_user[user_id]

      user_dates[user_id] << submission_date
      picked_past_date_for_user[user_id] = true if submission_date < start_date
    end

    user_dates.keys.each do |user_id|
      date_range.each do |d|
        if all_user_statuses[[user_id, d]].present?
          status = all_user_statuses[[user_id, d]].last.status
          result[d][status] ||= 0
          result[d][status] += 1
          
          next
        end

        closest_submission_date = user_dates[user_id].find { |prev_date| prev_date < d }

        if closest_submission_date.present? &&
          all_user_statuses[[user_id, closest_submission_date]].last.status == 'recovery' &&
          all_user_statuses[[user_id, closest_submission_date]].last.expiration_date >= d
          result[d]['recovery'] ||= 0
          result[d]['recovery'] += 1
        end
      end
    end

    result.each do |k, v|
      result[k]['unknown'] = total_users - v.values.sum
    end
    result
  end
end
