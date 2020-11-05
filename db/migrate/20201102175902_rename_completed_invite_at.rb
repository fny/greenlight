class RenameCompletedInviteAt < ActiveRecord::Migration[6.0]
  def change
    rename_column(:users, :completed_invite_at, :completed_welcome_at)
  end
end
