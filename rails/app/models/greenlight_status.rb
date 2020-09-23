# == Schema Information
#
# Table name: greenlight_statuses
#
#  id                 :uuid             not null, primary key
#  is_override        :boolean          default(TRUE), not null
#  status             :string           not null
#  status_expires_at  :datetime         not null
#  status_set_at      :datetime         not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  created_by_user_id :uuid
#  user_id            :uuid             not null
#
# Indexes
#
#  index_greenlight_statuses_on_created_by_user_id  (created_by_user_id)
#  index_greenlight_statuses_on_status              (status)
#  index_greenlight_statuses_on_user_id             (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_user_id => users.id) ON DELETE => nullify
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
class GreenlightStatus < ApplicationRecord
  belongs_to :user
  belongs_to :created_by_user, class_name: 'User'
  scope :submitted_today, -> { where(created_at: Time.zone.now.beginning_of_day..Time.zone.now.end_of_day) }
  scope :recently_created, -> { where(created_at: 20.days.ago.beginning_of_day..Time.zone.now.end_of_day) }
end
