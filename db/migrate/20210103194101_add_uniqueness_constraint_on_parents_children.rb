class AddUniquenessConstraintOnParentsChildren < ActiveRecord::Migration[6.1]
  def change
    ParentChild.dedupe(%i[parent_id child_id])
    add_index :parents_children, %i[parent_id child_id], unique: true
  end
end
