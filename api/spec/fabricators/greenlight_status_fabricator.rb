# frozen_string_literal: true
Fabricator(:greenlight_status) do
  status { 'cleared' }
  submitted_at { Time.now }
  expiration_date { |attrs| attrs[:submitted_at] + 1.day }
end
