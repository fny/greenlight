class CreateCovidData < ActiveRecord::Migration[6.0]
  def change
    create_table :covid_data do |t|
      t.text :fips, null: false, default: 'Unknown'
      t.date :date, null: false, default: 'Unknown'
      t.text :county, null: false, default: 'Unknown'
      t.text :state, null: false, default: 'Unknown'
      t.integer :cases, default: 0
      t.integer :deaths, default: 0
      t.integer :confirmed_cases, default: 0
      t.integer :confirmed_deaths, default: 0
      t.integer :probable_cases, default: 0
      t.integer :probable_deaths, default: 0

      t.timestamps
    end
  end
end
