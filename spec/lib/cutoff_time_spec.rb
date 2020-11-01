# frozen_string_literal: true
require 'rails_helper'

RSpec.describe CutoffTime do
  describe '#<=>' do
    [
      ['7:00pm', '7:00pm', :==, true],
      ['7:00pm', '6:59pm', :>, true],
      ['7:00pm', '7:01pm', :<, true],
      ['12:00am', '1:00am', :<, true],
      ['12:00am', '11:59pm', :<, true]
    ].each do |cutoff, time, comparator, expected|
      it "#{cutoff} #{comparator} #{time} is #{expected}" do
        result = CutoffTime.new(Time.zone.parse(cutoff)).send(comparator, Time.zone.parse(time))
        expect(result).to eq(expected)
      end
    end
  end

  describe '#round' do
    [
      ['7:00pm',  '2020-01-01 7:00pm',  '2020-01-02'],
      ['7:00pm',  '2020-01-01 7:00am',  '2020-01-01'],
      ['7:00pm',  '2020-01-01 6:59pm',  '2020-01-01'],
      ['7:00pm',  '2020-01-01 7:01pm',  '2020-01-02'],
      ['12:00am', '2020-01-01 1:00am',  '2020-01-02'],
      ['12:00am', '2020-01-01 11:59pm', '2020-01-02'],
      ['7:00pm',  '2020-02-01 6:59pm',  '2020-02-01'],
      ['7:00pm',  '2020-02-01 7:01pm',  '2020-02-02']
    ].each do |cutoff, time, expected|
      it "#{cutoff} then #{time} is on #{expected}" do
        result = CutoffTime.new(Time.zone.parse(cutoff)).round(Time.zone.parse(time)).strftime('%Y-%m-%d')
        expect(result).to eq(expected)
      end
    end
  end
end
