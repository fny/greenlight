require 'rails_helper'

RSpec.describe SymptomSurvey, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:greenlight_status) }
    it { should validate_presence_of(:medical_events) }
  end
end
