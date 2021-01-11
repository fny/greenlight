# frozen_string_literal: true

# FIXME: Contrainst needed here
class Cohort < ApplicationRecord
  belongs_to :location
  has_many :cohort_users
  has_many :users, through: :cohort_users

  validates :location, presence: true
  validates :category, presence: true
  validates :name, presence: true
  validate :cohort_in_schema
  validates :name, uniqueness: { scope: %i[location_id category] }
  validates :code, uniqueness: { scope: :location_id }

  before_save :set_code

  def self.format_code(category, name)
    "#{category}:#{name}".downcase.squeeze(' ').tr(' ', '_').tr('#', '')
  end

  def set_code
    self.code = Cohort.format_code(category, name)
  end

  def cohort_in_schema
    if location.blank?
      errors.add(:cohort, "no location given, can't verify the cohorts")
      return
    end

    unless location.downcased_cohort_schema.key?(category.downcase)
      errors.add(:cohort, "Category #{category.downcase} not found in cohort schema: #{location.downcased_cohort_schema}")
      return
    end

    unless location.downcased_cohort_schema[category.downcase].include?(name.downcase)
      errors.add(:cohort, "Value #{name.downcase} not found in cohort schema for category #{category}. Available #{location.downcased_cohort_schema[category.downcase]}")
    end
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
#  code          :string           not null
#
# Indexes
#
#  index_cohorts_on_created_by_id                      (created_by_id)
#  index_cohorts_on_deleted_by_id                      (deleted_by_id)
#  index_cohorts_on_location_id                        (location_id)
#  index_cohorts_on_location_id_and_category_and_name  (location_id,category,name) UNIQUE
#  index_cohorts_on_location_id_and_code               (location_id,code) UNIQUE
#  index_cohorts_on_updated_by_id                      (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (deleted_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#  fk_rails_...  (updated_by_id => users.id) ON DELETE => nullify
#
