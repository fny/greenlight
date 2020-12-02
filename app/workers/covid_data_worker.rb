# frozen_string_literal: true

require 'open-uri'
require 'csv'

class CovidDataWorker < ApplicationWorker
  def perform
    url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/live/us-counties.csv'
    csv_table = CSV.parse(URI.open(url).read, headers: true)
    data_array = csv_table.map(&:to_h).select { |data| data['state'] == 'North Carolina' }
    CovidData.delete_all
    CovidData.create(data_array)
  end
end
