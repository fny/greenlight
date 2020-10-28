# frozen_string_literal: true
Fabricator(:medical_event) do
  event_type "none"
  occurred_at "2020-09-14 17:59:45"
end

Fabricator(:red_medical_event, from: :medical_event) do
  event_type {
    ['covid_test_positive', 'covid_diagnosis'].sample
  }
  occurred_at { DateTime.now }
end

Fabricator(:yellow_medical_event, from: :medical_event) do
  event_type {
    ['fever', 'new_cough', 'difficulty_breathing', 'fever', 'chills', 'taste_smell'].sample
  }
  occurred_at { DateTime.now }
end
