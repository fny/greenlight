class AddPermalinkToSurveys < ActiveRecord::Migration[6.1]
  def change
    add_column :surveys, :permalink, :string
  end
end
