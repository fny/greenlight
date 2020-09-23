# == Schema Information
#
# Table name: parents_children
#
#  id             :uuid             not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  child_user_id  :uuid             not null
#  parent_user_id :uuid             not null
#
# Indexes
#
#  index_parents_children_on_child_user_id   (child_user_id)
#  index_parents_children_on_parent_user_id  (parent_user_id)
#
# Foreign Keys
#
#  fk_rails_...  (child_user_id => users.id) ON DELETE => cascade
#  fk_rails_...  (parent_user_id => users.id) ON DELETE => cascade
#
class ParentChild < ApplicationRecord
  self.table_name = 'parents_children'
  belongs_to :parent_user, class_name: 'User'
  belongs_to :child_user, class_name: 'User'
end
