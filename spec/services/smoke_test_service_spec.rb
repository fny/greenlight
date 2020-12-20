# frozen_string_literal: true
require 'rails_helper'

RSpec.describe SmokeTestService do
  let!(:wrong_token) { Faker::Lorem.word }
  let!(:right_token) { Faker::Lorem.characters(number: 10) }

  describe 'auth check' do
    context 'when an invalid token is provided' do
      pending 'raises UnauthorizedError' do
        expect { SmokeTestService.new(wrong_token) }.to raise_error(
          SmokeTestService::UnauthorizedError
        )
      end
    end
  end

  context 'with correct token' do
    before do
      allow_any_instance_of(SmokeTestService).to receive(:ensure_valid_token!)
                                             .and_return(nil)
    end

    let!(:fixtures_path) { "#{Rails.root}/db/fixtures/smoke_test/development" }
    subject { SmokeTestService.new(right_token, assume_dirty: false) }

    describe '#populate' do
      context 'when the context already exists' do
        before { Fabricate(:location, permalink: SmokeTestService::TEST_LOCATION_PERMALINK) }

        pending 'raises ContextConflictError' do
          expect { subject.populate }.to raise_error(SmokeTestService::ContextConflictError)
        end
      end

      context 'when the context does not exist' do
        before do
          @original_counts = entities_count_arr
        end

        pending 'generates the context' do
          subject.populate(fixtures_path)

          expect(entities_count_arr.sum).to be > @original_counts.sum
        end
      end
    end

    describe '#purge' do
      context 'when the context does not exist' do
        pending 'raises NoContextError' do
          expect { subject.purge }.to raise_error(SmokeTestService::NoContextError)
        end
      end

      context 'when the context exists' do
        before do
          @original_counts = entities_count_arr
          subject.populate(fixtures_path)
        end

        pending 'cleans up the context' do
          subject.purge

          expect(entities_count_arr).to eq(@original_counts)
        end
      end
    end
  end
end

def entities_count_arr(models = nil)
  models ||= [
    Location,
    User,
    LocationAccount,
    GreenlightStatus,
    MedicalEvent,
    ParentChild,
    Cohort,
    CohortUser,
  ]

  models.map(&:count)
end
