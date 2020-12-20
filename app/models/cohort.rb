# frozen_string_literal: true

# FIXME: Contrainst needed here
class Cohort < ApplicationRecord
  belongs_to :location
  has_many :cohort_users
  has_many :users, through: :cohort_users

  # PERF: N+1 query like issue here. Also, all the cohorts should be checked first
  # and normalized.
  #
  # @param location Location
  # @param cohorts [Hash{String => Array<String>}]
  # @return [Array<Cohort>]
  def self.find_or_create_cohorts!(location, cohorts)
    persisted = []
    transaction do
      cohorts.each do |category, names|
        names.each do |name|
          persisted << (
            Cohort.find_by(location: location, category: category, name: name) ||
              Cohort.create!(location: location, category: category, name: name)
          )
        end
      end
    end
    persisted
  end
end

# == Schema Information
#
# Table name: cohorts
#
#  id            :bigint           not null, primary key
#  name          :string           not null
#  category      :string           not null
#  location_id   :bigint           not null
#  created_by_id :bigint
#  updated_by_id :bigint
#  deleted_by_id :bigint
#  deleted_at    :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_cohorts_on_created_by_id  (created_by_id)
#  index_cohorts_on_deleted_by_id  (deleted_by_id)
#  index_cohorts_on_location_id    (location_id)
#  index_cohorts_on_updated_by_id  (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (deleted_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#  fk_rails_...  (updated_by_id => users.id) ON DELETE => nullify
#
