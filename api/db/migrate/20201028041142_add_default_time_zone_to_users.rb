class AddDefaultTimeZoneToUsers < ActiveRecord::Migration[6.0]
  def change
    change_column_default(:users, :time_zone, from: nil, to: 'America/New_York')
  end
end
