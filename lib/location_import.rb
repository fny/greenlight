# frozen_string_literal: true
class LocationImport
  attr_reader :location, :rimport, :simport
  def initialize(permalink)
    @location = Location.find_by_id_or_permalink(permalink)
    @staff_path = "data/locations/#{permalink}/staff.xlsx"
    @roster_path = "data/locations/#{permalink}/roster.xlsx"
    @location_path = "data/locations/#{permalink}/location.json"
  end

  def save_location!
    if @location.nil?
      @location = Location.new
      @location.assign_attributes(JSON.parse(File.read(@location_path)))
      @location.save!
    end
    @location
  end

  def import_roster!
    @rimport = OldRosterImport.new(@location, @roster_path)
    @rimport.process_rows!
    true
  end

  def import_staff!
    @simport = OldStaffImport.new(@location, @staff_path)
    @simport.process_rows!
    true
  end

  def run!
    ActiveRecord::Base.transaction do
      save_location!
      import_roster!
      import_staff!
    end
  end
end
