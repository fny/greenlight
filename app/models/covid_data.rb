class CovidData < ApplicationRecord
end

# == Schema Information
#
# Table name: covid_data
#
#  id               :bigint           not null, primary key
#  fips             :text             default("Unknown"), not null
#  date             :date             not null
#  county           :text             default("Unknown"), not null
#  state            :text             default("Unknown"), not null
#  cases            :integer          default(0)
#  deaths           :integer          default(0)
#  confirmed_cases  :integer          default(0)
#  confirmed_deaths :integer          default(0)
#  probable_cases   :integer          default(0)
#  probable_deaths  :integer          default(0)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
