# frozen_string_literal: true

Fabricator(:survey) do
  question { 'Vaccine Good' }
  choices { {"1" => "Yes", "2" => "No"} }
end

Fabricator(:full_survey, from: :survey) do
  question_es { 'Buena vacuna' }
  choices_es { {"1" => "si", "2" => "No"} }
end
