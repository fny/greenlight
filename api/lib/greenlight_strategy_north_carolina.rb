# frozen_string_literal: true

# @attr_reader [Array<MedicalEvent>]
# Based on https://files.nc.gov/covid/documents/guidance/Strong-Schools-NC-Public-Health-Toolkit.pdf
class GreenlightStrategyNorthCarolina
  # @return [Array<MedicalEvent>]
  attr_reader :medical_events

  # @return [SelfControl::DSL]
  attr_reader :trace

  # @param medical_events [Array<MedicalEvent>]
  # @param previous_statuses [Array<MedicalEvent>]
  # @param cleared_override_date [Date, nil]
  def initialize(medical_events, previous_medical_events, cleared_override_date = nil)
    @medical_events = (medical_events + previous_medical_events).sort_by { |e| e.occurred_at }
    if cleared_override_date
      @medical_events = medical_events.filter { |e| e.occurred_at > cleared_override_date}
    end
  end

  def cutoff_round(time)
    GreenlightStatus::DAILY_CUT_OFF.round(time)
  end

  def events_last_14_days
    medical_events.filter { |e| e.occurred_at > 14.days.ago }
  end

  def events_last_10_days
    medical_events.filter { |e| e.occurred_at > 10.days.ago }
  end

  def exposure_within_last_14_days
    events_last_14_days.filter { |e| e.event_type == MedicalEvent::COVID_EXPOSURE }.max { |e| e.occurred_at }
  end

  def asymptomatic_last_14_days?
    !events_last_14_days.any? { |e| e.symptom? }
  end

  def asymptomatic_last_10_days?
    !events_last_10_days.any? { |e| e.symptom? }
  end

  def positive_diagnosis_within_last_10_days
    events_last_10_days.filter { |e| e.has_covid? }.max { |e| e.occurred_at }
  end

  def first_symptom_last_10_days
    events_last_10_days.filter { |e| e.symptom? }.min { |e| e.occurred_at }
  end

  def symptomatic_last_14_days?
    medical_events.any? { |e| e.occurred_at.today? && e.symptom? }
  end

  def yesterday?(t)
    t.to_date == 1.day.ago.to_date
  end

  def fever_yesterday_or_today?
    medical_events.any? { |e| (e.occurred_at.today? || yesterday?(e.occurred_at)) && e.fever? }
  end

  def cough_today?
    medical_events.any? { |e| e.occurred_at.today? && e.cough? }
  end

  def breathing_issues_today?
    medical_events.any? { |e| e.occurred_at.today? && e.breathing_issues? }
  end

  def covid_diagnosis_within_10_days?
    events_last_10_days.any? { |e| e.has_covid? }
  end

  def not_tested_within_10_days?
    !events_last_10_days.any? { |e| e.test_result? }
  end

  def more_than_one_day_since_negative_test?
    last_negative = events_last_10_days.max { |e| e.event_type == MedicalEvent::COVID_TEST_NEGATIVE }
    return false unless last_negative
    (Time.current - last_negative.occurred_at) >= 1.day
  end

  def more_than_one_day_since_ruled_out?
    last_ruled_out = events_last_10_days.max { |e| e.event_type == MedicalEvent::COVID_RULED_OUT }
    return false unless last_ruled_out
    (Time.current - last_ruled_out.occurred_at) >= 1.day
  end

  def symptoms_within_10_days?
    first_symptom = first_symptom_last_10_days
    return false if !first_symptom
    first_symptom.occurred_at < 10.days.ago
  end

  def exposure?
    exposure_within_last_14_days.present?
  end

  def positive_diagnosis?
    positive_diagnosis_within_last_10_days.present?
  end

  def symptomatic_today?
    medical_events.any? { |e| e.occurred_at.today? && e.symptom? }
  end

  def status
    @trace = SelfControl::Flow.new(self) do
      # (1) if exposure and asymptomatic within last 14 days: recovery
      # TODO: if negative test, what do we do?
      If(And(:exposure?, :asymptomatic_last_14_days?)) {
        exposure = exposure_within_last_14_days

        Return GreenlightStatus.new(
          status: GreenlightStatus::RECOVERY,
          submitted_at: Time.current,
          expiration_date: cutoff_round(exposure.occurred_at + 13.days),
          reason: 'recovery_asymptomatic_covid_exposure'
        )
      }

      # (2) if diagnosis and asymptomatic within last 10 days, recovery
      If(And(:positive_diagnosis?, :asymptomatic_last_10_days?)) {
        diagnosis = positive_diagnosis_within_last_10_days
        Return GreenlightStatus.new(
          status: GreenlightStatus::RECOVERY,
          submitted_at: Time.current,
          expiration_date: cutoff_round(diagnosis.occurred_at + 9.days),
          reason: 'recovery_diagnosed_asymptomatic'
        )
      }

      # (3) if symptomatic today
      # (3a) if confirmed positive or not tested within last 10 days
      # (3a1) if 10 days since first symptoms, no fever last 24 hours, improvement coughing and breathing, cleared
      # (3a2) otherwise, recovery/pending depending on test status until 10 days from status
      # (3b) if negative test
      # (3c1) if 1+ day since test home until no fever and feel well, cleared
      # (3c2) otherwise, pending
      # (3d) if alternative diagnosis, follow school procedures
      first_symptom = first_symptom_last_10_days
      If(:symptomatic_today?) {
        If(Or(:covid_diagnosis_within_10_days?, :not_tested_within_10_days?), 'symptomatic and positive or not tested') {
          If(And(:symptoms_within_10_days?, Not(:fever_yesterday_or_today?), Or(Not(:cough_today?), Not(:breathing_issues_today?))), 'symptomatic improving' )  {
            Return GreenlightStatus.new(
              status: GreenlightStatus::CLEARED,
              submitted_at: Time.current,
              expiration_date: cutoff_round(Time.current),
              reason: 'cleared_with_symptom_improvement'
            )
          }.Else('symptomatic not improving') {
            If(:covid_diagnosis_within_10_days?) {
              Return GreenlightStatus.new(
                status: GreenlightStatus::RECOVERY,
                submitted_at: Time.current,
                expiration_date: cutoff_round(first_symptom.occurred_at + 9.days),
                reason: 'recovery_from_diagnosis'
              )
            }.Else('not tested') {
              Return GreenlightStatus.new(
                status: GreenlightStatus::PENDING,
                submitted_at: Time.current,
                expiration_date: cutoff_round(first_symptom.occurred_at + 9.days),
                reason: 'pending_needs_diagnosis'
              )
            }
          }
        }.Else('symptomatic and negative') {
          If(And(Or(:more_than_one_day_since_negative_test?, :more_than_one_day_since_ruled_out?), Not(:fever_yesterday_or_today?)), 'a day has passed no fever') {
            Return GreenlightStatus.new(
              status: GreenlightStatus::CLEARED,
              submitted_at: Time.current,
              expiration_date: cutoff_round(Time.current),
              reason: 'cleared_alternative_diagnosis'
            )
          }.Elsif(:fever_yesterday_or_today?) {
            Return GreenlightStatus.new(
              status: GreenlightStatus::RECOVERY,
              submitted_at: Time.current,
              expiration_date: cutoff_round(Time.current),
              reason: 'recovery_not_covid_has_fever'
            )
          }.Else {
            Return GreenlightStatus.new(
              status: GreenlightStatus::RECOVERY,
              submitted_at: Time.current,
              expiration_date: cutoff_round(Time.current),
              reason: 'recovery_return_tomorrow'
            )
          }
        }
      }

      Return GreenlightStatus.new(
        status: GreenlightStatus::CLEARED,
        submitted_at: Time.current,
        expiration_date: cutoff_round(Time.current),
        reason: 'cleared'
      )
    end

    result = @trace.result
    result.logical_trace = @trace.to_s
    result.medical_events = medical_events
    result
  end
end
