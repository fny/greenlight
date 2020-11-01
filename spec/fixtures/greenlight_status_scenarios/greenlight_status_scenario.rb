# frozen_string_literal: true

require 'csv'

class GreenlightStatusScenario
  attr_reader :rows, :id

  # @param [String] id - name of the scenario, correpsonds with CSV file
  def initialize(id)
    @id = id
    file_path = File.join(File.dirname(__FILE__), "#{id}.csv")
    @rows = CSV.read(file_path, headers: true).map { |r| Row.new(r, self) }
    ensure_unique_row_ids
  end

  def each(&block)
    @rows.each(&block)
  end

  # A random IANA time zone used to ensure are time zone agnostic
  #
  # @return [String]
  def time_zone
    @time_zone ||= ActiveSupport::TimeZone.all.map { |x| x.tzinfo.name }.sample
    if false
      false
    end
    'America/New_York'
  end

  def ensure_unique_row_ids
    ids = rows.map(&:id)
    raise "Ids are not unique for scenario #{id}" if ids.length != ids.uniq.length
  end

  class Row
    # Represents a row in a scenario spreadsheet. Each row may include a new
    # status submission and a check for what the current status is.
    #
    # @param [CSV::Row] csv_row - row from the sheet @param
    # @param [GreenlightStatusScenario] scenario - the parent scenario
    #
    def initialize(csv_row, scenario)
      @row = csv_row
      @scenario = scenario
    end

    # Does this row match certain chriterion?
    #
    # @param [<Type>] scenario_id <description>
    # @param [<Type>] row_id <description>
    # @return [<Type>] <description>
    def matches?(scenario_id, row_id)
      $stdout.puts("(#{@scenario.id} == #{scenario_id}) && (#{id} == #{row_id.to_s})")
      (@scenario.id == scenario_id) && (id == row_id.to_s)
    end

    def title
      "row #{id}: Day #{day} @ #{timestamp.strftime('%m/%d/%y %I:%M %p')} #{note}".squeeze(' ').strip
    end

    # A row is a submission when an expected result is provided
    #
    # @return [Boolean] Whether a result is present
    def submission?
      self.result.present?
    end

    # <Description>
    #
    # @return [<Type>] <description>
    def day
      Integer(@row.fetch('Day'))
    end

    # When was this submission or check made?
    #
    # @returns [Time]
    def timestamp
      Time.zone.strptime(@row.fetch('Timestamp'), '%m/%d/%y %I:%M %p')
    end

    # Medical events listed as part of the submission
    #
    # @returns [Array<MedicalEvent>]
    def medical_events
      events = eval(@row.fetch('Medical Events') || '') # rubocop:disable Security/Eval
      return [] unless events

      events.map { |e| MedicalEvent.new(event_type: e, occurred_at: timestamp) }
    end

    # @returns [String]
    def id
      @id ||= @row.fetch('Id').strip
    end

    # @returns [Row, nil]
    def next_row
      index = @scenario.rows.find_index(self) + 1
      return if index >= @scenario.rows.size

      @scenario.rows[index]
    end

    # This is the expected result of the submission, One of {Greenlight::STATUSES}.
    #
    # @returns [String]
    def result
      eval(@row.fetch('Result') || '') # rubocop:disable Security/Eval
    end

    # Expected expiration date of the status
    #
    # @returns [Date]
    def expiration_date
      Time.zone.strptime(@row.fetch('Expiration'), '%m/%d/%y').to_date
    end

    # Expected date where user must submit a new status
    #
    # @returns [Date]
    def follow_up_date
      Time.zone.strptime(@row.fetch('Follow Up'), '%m/%d/%y').to_date
    end

    # Expeted status for the current day regardless of whether a submission has
    # occurred. One of {Greenlight::STATUSES}.
    #
    # @returns [String]
    def todays_status
      eval(@row.fetch('Todays Status') || '') # rubocop:disable Security/Eval
    end

    # Should this submission bypass certain validations like multiple
    # submissions on a given day?
    #
    # @return [Boolean]
    def override?
      @row.fetch('Override') == 'TRUE'
    end

    # @return [Boolean] whether we expect and error for this submission attempt
    def error?
      @row.fetch('Error') == 'TRUE'
    end

    # Additional notes for the developer.
    #
    # @return [Boolean]
    def note
      @row.fetch('Note')
    end
  end
end
