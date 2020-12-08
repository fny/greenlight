# frozen_string_literal: true

# REFACTOR: @jeremy.he.codes We need to discuss this code sometime.
module Reports
  class Location
    attr_reader :location, :options
    DEFAULT_SURVEY_WEEKS = 3

    def initialize(location, options = {})
      @location = location
      @options = {
        survey_weeks: DEFAULT_SURVEY_WEEKS
      }.merge(options)
    end

    def to_h
      {
        location: @location.as_json,
        survey: survey.to_h,
        status: status.to_h,
      }
    end

    def to_json
      self.to_h.to_json
    end

    # SELECT stats.submission_date, count(*) FROM
    #   (SELECT DISTINCT ON (users.id, submission_date) submission_date FROM greenlight_statuses
    #     LEFT JOIN users ON greenlight_statuses.user_id = users.id
    #       LEFT JOIN location_accounts ON location_accounts.user_id = users.id
    #         WHERE location_accounts.location_id = 2 AND submission_date >= '2020-11-09'
    #   ) AS stats
    # GROUP BY stats.submission_date
    # ORDER BY submission_date DESC
    def survey
      return @survey if @survey.present?

      from_date = Date.today - options[:survey_weeks].weeks

      result = DB.query(<<~SQL.squish, location_id: location.id, from_date: from_date)
        select stats.submission_date, count(*)
        from (
          select distinct on (users.id, submission_date)
            submission_date
          from
            greenlight_statuses
          left join
            users
          on greenlight_statuses.user_id = users.id
          left join
            location_accounts
          on location_accounts.user_id = users.id
          where
            location_accounts.location_id = :location_id
          and
            submission_date >= :from_date
        ) as stats
        group by
          submission_date
        order by
          submission_date DESC
      SQL

      @survey = Convertable.new(result, type: :survey)
    end

    # SELECT stats.status, count(*) FROM
    #   (SELECT DISTINCT ON (users.id) status FROM greenlight_statuses
    #     LEFT JOIN users ON greenlight_statuses.user_id = users.id
    #       LEFT JOIN location_accounts ON location_accounts.user_id = users.id
    #         WHERE location_accounts.location_id = 2
    #     ORDER BY users.id, submission_date DESC) AS stats
    # GROUP BY stats.status
    def status
      return @status if @status.present?

      result = DB.query(<<~SQL.squish, location_id: location.id)
        select stats.status, count(*)
        from (
          select distinct on (users.id)
            status
          from
            greenlight_statuses
          left join
            users
          on greenlight_statuses.user_id = users.id
          left join
            location_accounts
          on location_accounts.user_id = users.id
          where
            location_accounts.location_id = :location_id
          order by
            users.id, greenlight_statuses.created_at DESC
        ) as stats
        group by
          stats.status
      SQL

      @status = Convertable.new(result, type: :status)
    end

    class Convertable
      attr_reader :body, :type

      def initialize(body, type: :survey)
        @body = body
        @type = type
      end

      def to_h
        self.send("#{type}_to_h")
      rescue NoMethodError
        body.to_h
      end

      def to_json
        self.to_h.to_json
      end

      private

      # @body [#<Class submission_date:, count:>]
      def survey_to_h
        body.map do |stat|
          {
            'date' => stat.submission_date,
            'count' => stat.count
          }
        end
      end

      # @body [#<Class status:, count:>]
      def status_to_h
        statuses = GreenlightStatus::STATUSES
        initial_h = statuses.each_with_object({}) { |k, h| h[k] = 0 }

        body.reduce(initial_h) do |h, stat|
          h.merge({
            stat.status => stat.count
          })
        end
      end
    end

    # Returns a table of locations along with a count of their registered users
    # and employee counts
    def self.registrations
      DB.query(<<~SQL.squish)
        select
          locations.id,
          locations.permalink,
          locations.registration_code,
          locations.name,
          locations.zip_code,
          locations.employee_count,
          registrations.registered_count
        from
          locations
        join
          (select
            locations.id as location_id,
            count(la) as registered_count
          from
            locations
          join
            location_accounts la
          on locations.id = la.location_id
          group by locations.id) as registrations
        on registrations.location_id = locations.id
      SQL
    end

    def self.owners
      DB.query(<<~SQL.squish)
        select
          locations.id as location_id,
          locations.name as location_name,
          locations.permalink,
          users.first_name,
          users.last_name,
          users.email
        from
          users,
          locations,
          (select user_id, location_id from location_accounts where permission_level = 'owner') as la
        where
          users.id = la.user_id and
          locations.id = la.location_id
      SQL
    end
  end
end
