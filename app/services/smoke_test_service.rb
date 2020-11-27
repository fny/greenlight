# frozen_string_literal: true
require 'seed-fu'

class SmokeTestService
  UnauthorizedError = Class.new(StandardError)
  ContextConflictError = Class.new(StandardError)
  NoContextError = Class.new(StandardError)

  TEST_LOCATION_PERMALINK = "greenlight-#{Rails.env}-test-location"
  FIXTURES_PATH = "#{Rails.root}/db/fixtures/smoke_test/#{Rails.env}"
  USER_LOGS_PATH = "#{Rails.root}/tmp/#{TEST_LOCATION_PERMALINK}_users"
  TMP_TOKEN = 'greenlight_smoke_test_token'

  def self.log_user_ids(user_ids)
    File.open(USER_LOGS_PATH, 'w+') do |f|
      f.write user_ids.join(',')
    end
  end

  def initialize(token, assume_dirty: true)
    @token = token
    @assume_dirty = assume_dirty

    ensure_valid_token!
  end

  def populate_and_return
    populate
    exposure
  end

  def populate(fixtures_path = FIXTURES_PATH)
    ensure_no_context_conflict!

    SeedFu.seed(fixtures_path)
  end

  def purge
    ensure_context_exists!

    ActiveRecord::Base.transaction do
      users = @location.users
      location_accounts = @location.location_accounts
      cohorts = @location.cohorts
      
      # Purge cohort users relationship
      CohortUser.where(cohort_id: cohorts.map(&:id)).destroy_all
      # Purge cohorts
      cohorts.destroy_all

      # Purge parent child relationship
      ParentChild.where(parent_id: user_ids).destroy_all

      # Purge medical events
      MedicalEvent.where(user_id: user_ids).destroy_all
      # Purge greenlight statuses
      GreenlightStatus.where(user_id: user_ids).destroy_all

      # Purge location accounts relationship
      location_accounts.destroy_all
      # Purge Users
      User.where(id: user_ids).destroy_all

      @location.destroy
    end
  end

  private

  def ensure_context_exists!
    @location = Location.find_by permalink: TEST_LOCATION_PERMALINK

    unless @location
      raise NoContextError
    end
  end

  def ensure_no_context_conflict!
    return unless Location.find_by permalink: TEST_LOCATION_PERMALINK

    raise ContextConflictError unless @assume_dirty
    purge
  end

  def ensure_valid_token!
    # temporary fixed check until dynamic auth mechanism
    unless @token == TMP_TOKEN
      raise UnauthorizedError
    end
  end

  def exposure
    location = Location.find_by!(permalink: TEST_LOCATION_PERMALINK)

    {
      location: location
    }
  end

  def user_ids
    return @user_ids if @user_ids.present?

    @user_ids = File.read(USER_LOGS_PATH).split(',')
    File.delete(USER_LOGS_PATH)
    @user_ids
  end
end
