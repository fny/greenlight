class RemoveAcceptedTermsAtFromUsers < ActiveRecord::Migration[6.0]
  def change
    remove_column :users, :accepted_terms_at, :datetime
  end
end
