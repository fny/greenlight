# frozen_string_literal: true
require 'rails_helper'

RSpec.describe GreenlightStatus, type: :model do
  let(:user) { Fabricate(:user) }

  describe 'validations' do
    it { should validate_presence_of(:user) }
    it { should validate_presence_of(:submission_date) }
    it { should validate_presence_of(:follow_up_date) }
    it { should validate_presence_of(:expiration_date) }

    def new_cleared_status
      GreenlightStatus.new_cleared_status(Time.current, created_by: user, user: user)
    end

    it 'allows submissions before and after the cut off' do
      travel_to Time.zone.parse('8:00 AM')
      new_cleared_status.save!
      travel_to Time.zone.parse('6:05 PM')
      new_cleared_status.save!
      expect(user.greenlight_statuses.count).to eq(2)
      travel_back
    end

    it 'does allows submissions next day when submitted after the cut off' do
      travel_to Time.zone.parse('6:05 PM')
      new_cleared_status.save!
      travel_to 1.day.from_now - 10.minutes
      expect {
        new_cleared_status.save!
      }.to raise_error(ActiveRecord::RecordInvalid)
      travel_back
    end

    it 'does not allow submissions within the same cutoff window' do
      travel_to Time.zone.parse('8:00 AM')
      new_cleared_status.save!
      travel_to Time.zone.parse('5:55 PM')
      expect {
        new_cleared_status.save!
      }.to raise_error(ActiveRecord::RecordInvalid)
      travel_back
    end

    it 'does not allow submissions within the same cutoff window part 2' do
      travel_to Time.zone.parse('6:05 PM')
      new_cleared_status.save!
      travel_to Time.zone.parse('5:55 PM')
      expect {
        new_cleared_status.save!
      }.to raise_error(ActiveRecord::RecordInvalid)
      travel_back
    end
  end

  describe 'callbacks' do
    it 'assigns associated users to medical events' do
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

  describe '.submittable_for?' do
    it 'is true when the user has not submitted a status' do
      expect(GreenlightStatus.submittable_for?(user)).to eq(true)
    end

    it 'is false when the user has submitted a status' do
      status = GreenlightStrategyNorthCarolina.new([], []).status
      status.user = user
      status.save!
      expect(GreenlightStatus.submittable_for?(user)).to eq(false)
    end
  end

  describe '#submitted_at=' do
    it 'assigns the same subission date and follow up date when before the cutoff' do
      status = GreenlightStatus.new
      status.submitted_at = Time.zone.parse('5:55 PM')
      expect(status.submission_date).to eq(Time.current.to_date)
      expect(status.follow_up_date).to eq(Time.current.to_date + 1.day)
    end

    it 'assigns the same subission date and follows up two days later from the cutoff' do
      status = GreenlightStatus.new
      status.submitted_at = Time.zone.parse('6:05 PM')
      expect(status.submission_date).to eq(Time.current.to_date)
      expect(status.follow_up_date).to eq(Time.current.to_date + 2.days)
    end
  end
end
