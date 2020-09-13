class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true
  # Sort records by date of creation instead of primary key
  # since we use UUIDs
  self.implicit_order_column = :created_at
end
