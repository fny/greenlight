class ParentChild < ApplicationRecord
  self.table_name = 'parents_children'
  belongs_to :parent, class_name: 'User'
  belongs_to :child, class_name: 'User'
end

# == Schema Information
#
# Table name: parents_children
#
#  id         :bigint           not null, primary key
#  parent_id  :bigint           not null
#  child_id   :bigint           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_parents_children_on_child_id   (child_id)
#  index_parents_children_on_parent_id  (parent_id)
#
# Foreign Keys
#
#  fk_rails_...  (child_id => users.id) ON DELETE => cascade
#  fk_rails_...  (parent_id => users.id) ON DELETE => cascade
#
