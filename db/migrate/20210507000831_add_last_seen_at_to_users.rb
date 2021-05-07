class AddLastSeenAtToUsers < ActiveRecord::Migration[6.1]
  def up
    add_column :users, :last_seen_at, :timestamp
    User.update_all('last_seen_at = last_sign_in_at')
  end

  def down
    remove_column :users, :last_seen_at, :timestamp
  end
end
