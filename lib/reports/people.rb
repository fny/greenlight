# frozen_literal_string: true
require 'csv'

module Reports
  class People
    SCHOOL_COLUMNS = "First Name, Last Name, Parent First Name, Parent Last Name, \
              Parent Email, Parent Phone, Submissions, Date Registered, \
              Last Date Yellow, Last Date Red, Last Test Date, \
              Last Test Result".split(', ').map(&:strip).freeze
    OTHER_COLUMNS = "First Name, Last Name, Submissions, Date Registered, \
              Last Date Yellow, Last Date Red, Last Test Date, \
              Last Test Result".split(', ').map(&:strip).freeze

    def initialize(location)
      @location = location
      @users = @location.users.includes(:parents)
      @is_school = @location.category == 'school'
    end

    def csv
      CSV.generate(headers: true) do |csv|
        csv << (@is_school ? SCHOOL_COLUMNS : OTHER_COLUMNS)

        @users.each do |user|
          csv << csv_row(user)
        end
      end
    end

    private

    def csv_row(user)
      parent = user.parents.first
      submission_stats = submission_stats(user)

      user_row = [ user.first_name, user.last_name ]

      if @is_school
        user_row << parent&.first_name
        user_row << parent&.last_name
        user_row << parent&.email
        user_row << parent&.mobile_number
      end

      user_row << submission_stats[:submissions].join(' ')
      user_row << user.created_at.strftime('%Y-%m-%d')
      user_row << submission_stats[:last_yellow_date]
      user_row << submission_stats[:last_red_date]
      user_row << submission_stats[:last_test_date]
      user_row << submission_stats[:last_test_result]
    end
  
    def submission_stats(user)
      statuses_chronical = user.greenlight_statuses.chronical

      submissions = []
      last_yellow_date = nil
      last_red_date = nil
      last_greenlight_status = statuses_chronical.last

      statuses_chronical.each do |greenlight_status|
        submissions << greenlight_status.status

        if greenlight_status.status == 'pending'
          last_yellow_date = greenlight_status.submission_date
        elsif greenlight_status.status == 'recovery'
          last_red_date = greenlight_status.submission_date
        end
      end

      {
        submissions: submissions,
        last_yellow_date: last_yellow_date,
        last_red_date: last_red_date,
        last_test_date: last_greenlight_status&.submission_date,
        last_test_result: last_greenlight_status&.status,
      }
    end
  end
end
