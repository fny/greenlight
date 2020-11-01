# frozen_string_literal: true

# rubocop:disable RSpec/BeforeAfterAll, RSpec/InstanceVariable
require 'rails_helper'
require 'fixtures/greenlight_status_scenarios/greenlight_status_scenario'

scenarios = %w[no_issues covid_exposure_asymptomatic covid_exposure_asymptomatic_after_cutoff].map do |s|
  GreenlightStatusScenario.new(s)
end

RSpec.describe GreenlightStrategyNorthCarolina, order: :defined do
  scenarios.each do |scenario|
    describe "#{scenario.time_zone} scenario #{scenario.id}" do
      # Before each scenario that runs, create a state on which to hold
      # previous statuses and events
      before(:context) do
        @state = Struct.new(
          :prev_events,
          :prev_statuses,
          :row
        ).new([], [], scenario.rows.first)
      end

      let!(:prev_time_zone) { Time.zone }

      let(:user) { Fabricate(:user, time_zone: scenario.time_zone) }

      before do
        Time.zone = user.time_zone
        travel_to @state.row.timestamp
        # Create statuses from previous statuses
        statuses = @state.prev_statuses.map do |status|
          status[:user_id] = user.id
          status[:created_by_id] = user.id
          status
        end
        user.greenlight_statuses.create!(statuses)
      end

      after do
        travel_back
        Time.zone = prev_time_zone
        @state.row = @state.row.next_row
      end

      # Run through each of the rows of the CSV in order
      scenario.rows.each do |row|
        # If the row checks a submission, run a submission example
        if row.submission?
          it "#{row.title}, sets status #{row.result}" do
            last_cleared_override = user.greenlight_statuses.filter(&:cleared_override?).max(&:expiry_date)
            strategy = GreenlightStrategyNorthCarolina.new(
              row.medical_events,
              @state.prev_events.map { |x| MedicalEvent.new(x) },
              last_cleared_override
            )
            status = strategy.status
            status.user = user
            status.created_by = user
            status.is_override = true if row.override?

            if row.error?
              expect { status.save! }.to raise_error(ActiveRecord::RecordInvalid)
            else
              expect { status.save! }.not_to raise_error
              user.reload
              @state.prev_events = user.medical_events.map do |x|
                x.attributes.except('id', 'user_id', 'created_by_id', 'user', 'created_by')
              end
              @state.prev_statuses = user.greenlight_statuses.map do |x|
                x.attributes.except('id', 'user_id', 'created_by_id', 'user', 'created_by')
              end
            end

            expect(status.status).to eq(row.result)
            expect(status.submission_date).to eq(Time.current.to_date)
            expect(status.follow_up_date).to eq(row.follow_up_date)
            expect(status.expiration_date).to eq(row.expiration_date)
            expect(user.inferred_status.status).to eq(row.todays_status)
          end

        # Otherwise, we're just checking to see if the status expected is todays status
        else
          it "#{row.title}, has status #{row.todays_status || 'nil'}" do
            expect(user.inferred_status.status).to eq(row.todays_status)
          end
        end

      end # rows
    end # describe
  end # scenarios
end

# rubocop:enable RSpec/BeforeAfterAll, RSpec/InstanceVariable
