# frozen_string_literal: true
require 'csv'
class GreenlightStatusScenario
  attr_reader :rows, :id
  attr_accessor :time_zone

  def initialize(id)
    @id = id
    file_path = File.join(File.dirname(__FILE__), "#{id}.csv")
    @rows = CSV.read(file_path, headers: true).map { |r| Row.new(r) }
  end

  def each(&block)
    @rows.each(&block)
  end

  private

  class Row
    def initialize(csv_row)
      @row = csv_row
    end

    def title
      "#{id}: Day #{day} @ #{timestamp.strftime('%m/%d/%y %I:%M %p')} #{note}".squeeze(' ').strip
    end

    def submission?
      !self.result.nil?
    end

    def day
      Integer(@row.fetch('Day'))
    end

    def timestamp
      Time.zone.strptime(@row.fetch('Timestamp'), '%m/%d/%y %I:%M %p')
    end

    def medical_events
      evald = eval(@row.fetch('Medical Events') || '')
      if evald
        return evald.map { |e| MedicalEvent.new(event_type: e, occurred_at: timestamp) }
      end
    end

    def id
      @row.fetch('Id')
    end

    def result
      eval(@row.fetch('Result') || '')
    end

    def expiration_date
      Time.zone.strptime(@row.fetch('Expiration'), '%m/%d/%y').to_date
    end

    def follow_up_date
      Time.zone.strptime(@row.fetch('Follow Up'), '%m/%d/%y').to_date
    end

    def todays_status
      eval(@row.fetch("Todays Status") || '')
    end

    def override?
      @row.fetch('Override') == "TRUE"
    end

    def error?
      @row.fetch('Error') == "TRUE"
    end

    def note
      @row.fetch('Note')
    end
  end
end
