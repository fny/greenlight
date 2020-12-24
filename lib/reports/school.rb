# frozen_literal_string: true
require 'csv'

module Reports
  class School
    COLUMNS = "First Name, Last Name, Parent First Name, Parent Last Name, \
              Parent Email, Parent Phone, Submissions, Date Registered, \
              Last Date Yellow, Last Date Red, Last Test Date, \
              Last Test Result".split(', ').map(&:strip).freeze

    def initialize(school)
      @school = school
    end

    def csv
      CSV.generate(headers: true) do |csv|
        csv << COLUMNS

        @school.users.each do |user|
          parent = user.parents.first

          csv << [
            user.first_name,
            user.last_name,
            parent&.first_name,
            parent&.last_name,
            parent&.email,
            parent&.mobile_number,
            user.greenlight_statuses.chronical.map(&:status).join(' '),
          ]
        end
      end
    end
  end
end
