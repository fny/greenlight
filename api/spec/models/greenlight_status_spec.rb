require 'rails_helper'

RSpec.describe GreenlightStatus, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:submission_date) }
    it { should validate_presence_of(:follow_up_date) }
    it { should validate_presence_of(:expiration_date) }
  end

  describe 'callbacks' do
    it 'assigns associated users to medical events' do
      user = Fabricate(:user)
      status = GreenlightStatus.new(
        user: user,
        created_by: user,
        submission_date: Time.current.to_date,
        follow_up_date: Time.current.to_date + 1,
        expiration_date: Time.current.to_date,
        status: GreenlightStatus::PENDING,
        medical_events: [MedicalEvent.new({ event_type: MedicalEvent::NEW_COUGH, occurred_at: Time.zone.now })],
      )

      status.save!

      expect(status.medical_events[0].created_by).to eq(status.created_by)
      expect(status.medical_events[0].user).to eq(status.user)
    end
  end

  describe '#submitted_at=' do
    it 'assigns the same subission date and follow up date when before the cutoff' do
      status = GreenlightStatus.new
      status.submitted_at = Time.zone.parse('5:55 PM')
      expect(status.submission_date).to eq(Time.current.to_date)
      expect(status.follow_up_date).to eq(Time.current.to_date + 1.day)
    end

    it 'assigns the same subission date and follow up date when before the cutoff' do
      status = GreenlightStatus.new
      status.submitted_at = Time.zone.parse('6:05 PM')
      expect(status.submission_date).to eq(Time.current.to_date)
      expect(status.follow_up_date).to eq(Time.current.to_date + 2.day)
    end
  end
end
