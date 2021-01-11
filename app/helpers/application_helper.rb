module ApplicationHelper
  include Pagy::Frontend

  def print_cohorts(cohorts)
    grouped = {}
    cohorts.each do |c|
      grouped[c.category] ||= []
      grouped[c.category] << c.name
    end
    grouped.to_json
  end
end
