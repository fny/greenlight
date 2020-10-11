require 'rails_helper'
require 'fixtures/greenlight_status_scenarios/greenlight_status_scenario'


# Scenario shape

scenarios = %w[ no_issues covid_exposure_asymptomatic covid_exposure_asymptomatic_after_cutoff ].map do |s|
  GreenlightStatusScenario.new(s)
end

GreenlightStrategyNorthCarolinaState = Struct.new(:prev_events, :prev_statuses)

RSpec.describe GreenlightStrategyNorthCarolina, order: :defined do
  @time_zone = ActiveSupport::TimeZone.all.map { |x| x.tzinfo.name }.sample

  scenarios.each do |scenario|
    describe "scenario #{scenario.id} #{@time_zone}" do
      before(:context) {
        @state = GreenlightStrategyNorthCarolinaState.new([], [])

      }
      let (:user) { Fabricate(:user, time_zone: @time_zone) }
      let! (:prev_time_zone) { Time.zone }
      before(:each) {
        user.greenlight_statuses.create!(@state.prev_statuses.map { |x| x[:user] = user; x[:created_by] = user; x  })
        Time.zone = user.time_zone
      }

      after(:each) {
        Time.zone = prev_time_zone
      }

      scenario.rows.each do |row|
        if row.submission?
          it "#{row.title}, sets status #{row.result}" do
            travel_to row.timestamp


            last_cleared_override = user.greenlight_statuses.filter { |s| s.cleared_override? }.max { |e| e.expiry_date }
            strategy = GreenlightStrategyNorthCarolina.new(row.medical_events, @state.prev_events.map { |x| MedicalEvent.new(x) }, last_cleared_override)
            status = strategy.status
            status.user = user
            status.created_by = user



            # if scenario.id == 'covid_exposure_asymptomatic' and row.id == '1'
            #   binding.pry
            # end

            if row.override?
              status.is_override = true
            end


            if row.error?
              expect { status.save! }.to raise_error(ActiveRecord::RecordInvalid)
            else
              expect { status.save! }.not_to raise_error
              user.reload
              @state.prev_events = user.medical_events.map { |x| x.attributes.except('id', 'user_id', 'created_by_id', 'user', 'created_by') }
              @state.prev_statuses = user.greenlight_statuses.map { |x| x.attributes.except('id', 'user_id', 'created_by_id', 'user', 'created_by') }
            end

            expect(status.status).to eq(row.result)
            expect(status.submission_date).to eq(Time.current.to_date)
            expect(status.follow_up_date).to eq(row.follow_up_date)
            expect(status.expiration_date).to eq(row.expiration_date)



            expect(user.inferred_greenlight_status.status).to eq(row.todays_status)
            travel_back
          end
        else
          it "#{row.title}, has status #{row.todays_status.nil? ? 'nil' : row.todays_status}" do
            travel_to row.timestamp
            expect(user.inferred_greenlight_status.status).to eq(row.todays_status)
            travel_back
          end
        end
      end
    end
  end
end
