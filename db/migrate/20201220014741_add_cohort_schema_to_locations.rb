class AddCohortSchemaToLocations < ActiveRecord::Migration[6.0]
  def change
    add_column :locations, :cohort_schema, :jsonb, default: {}, null: false
  end
end
