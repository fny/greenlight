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
#  index_greenlight_statuses_on_user_id             (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_user_id => users.id) ON DELETE => nullify
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
Fabricator(:greenlight_status) do
  user              nil
  status            "MyString"
  status_set_at     "2020-09-14 17:50:46"
  status_expires_at "2020-09-14 17:50:46"
  is_override       false
  created_by_user   nil
end
