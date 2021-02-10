# frozen_string_literal: true

class RosterImport < ApplicationRecord
  extend Enumerize
  has_one_attached :roster
  belongs_to :location
  belongs_to :created_by, class_name: 'User', optional: true
  enumerize :category, in: %i[student staff]
  enumerize :status, in: %i[received processing succeeded failed]
end

# == Schema Information
#
# Table name: roster_imports
#
#  id            :bigint           not null, primary key
#  location_id   :bigint           not null
#  category      :string
#  created_by_id :bigint
#  status        :string           default("received")
#  message       :text             default("")
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_roster_imports_on_created_by_id  (created_by_id)
#  index_roster_imports_on_location_id    (location_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#
