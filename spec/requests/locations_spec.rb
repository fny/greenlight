# frozen_string_literal: true
require 'swagger_helper'

RSpec.describe 'Locations Endpoint', type: :request do
  fixtures :all
  let(:location) {
    locations(:springfield_elementary)
  }

  describe 'POST /v1/locations/:location_id/register' do
    it 'creates a parent when given the right values' do
      email = 'mprince@moneymoneybrokers.com'
      post_json("/v1/locations/#{location.id}/register", body: {
        first_name: 'Martin Sr',
        last_name: 'Prince',
        email: email,
        mobile_number: '2123334444',
        role: 'parent',
        registration_code: location.student_registration_code,
        locale: 'en',
        children: [{
          first_name: 'Martin Jr',
          last_name: 'Prince'
        }]
      })
      user = User.find_by(email: email)
      expect(user.first_name).to eq('Martin Sr')
      expect(user.last_name).to eq('Prince')
      expect(user.children.first.first_name).to eq('Martin Jr')
      expect(user.children.first.last_name).to eq('Prince')
      expect(user.children.first.location_accounts.first.role).to eq(RegisterAccount::STUDENT)
      expect(user.children.first.location_accounts.first.location).to eq(location)

      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
      expect(response.cookies[Session::COOKIE_NAME]).not_to eq(nil)
      get_json('/v1/current-user')
      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
    end

    it 'creates a student when given the right values' do
      email = 'mprince@imakid.com'
      post_json("/v1/locations/#{location.id}/register", body: {
        first_name: 'Martin Jr',
        last_name: 'Prince',
        email: email,
        mobile_number: '2123334444',
        role: RegisterAccount::STUDENT,
        registration_code: location.student_registration_code,
        locale: 'en'
      })
      user = User.find_by(email: email)
      expect(user.first_name).to eq('Martin Jr')
      expect(user.last_name).to eq('Prince')
      expect(user.location_accounts.first.role).to eq(RegisterAccount::STUDENT)
      expect(user.location_accounts.first.location).to eq(location)
      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
      expect(response.cookies[Session::COOKIE_NAME]).not_to eq(nil)
      get_json('/v1/current-user')
      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
    end

    it 'creates a staff member when given the right values' do
      email = 'willie@janitor.com'
      post_json("/v1/locations/#{location.id}/register", body: {
        first_name: 'Willie',
        last_name: 'Janitor',
        email: email,
        mobile_number: '2123334444',
        role: RegisterAccount::STAFF,
        registration_code: location.registration_code,
        locale: 'en'
      })
      user = User.find_by(email: email)
      expect(user.first_name).to eq('Willie')
      expect(user.last_name).to eq('Janitor')
      expect(user.location_accounts.first.role).to eq(RegisterAccount::STAFF)
      expect(user.location_accounts.first.location).to eq(location)
      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
      expect(response.cookies[Session::COOKIE_NAME]).not_to eq(nil)
      get_json('/v1/current-user')
      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
    end

    it 'fails when an incorrect registration code is used' do
      email = 'willie@janitor.com'
      post_json("/v1/locations/#{location.id}/register", body: {
        first_name: 'Willie',
        last_name: 'Janitor',
        email: email,
        mobile_number: '2123334444',
        role: RegisterAccount::STAFF,
        registration_code: 'blah',
        locale: 'en'
      })
      expect(response_json.fetch(:errors)[0].fetch(:title)).to eq('Invalid request')
    end

    it 'fails when a student registration code is used to register staff' do
      email = 'willie@janitor.com'
      post_json("/v1/locations/#{location.id}/register", body: {
        first_name: 'Willie',
        last_name: 'Janitor',
        email: email,
        mobile_number: '2123334444',
        role: RegisterAccount::STAFF,
        registration_code: location.student_registration_code,
        locale: 'en'
      })
      expect(response_json.fetch(:errors)[0].fetch(:title)).to eq('Invalid request')
    end
  end

  describe 'POST /v1/locations/:location_id/join-with-children' do
    let(:user) { Fabricate(:user) }
    
    it "returns 401 if a user is not signed in" do
      post_json("/v1/locations/#{location.id}/join-with-children", body: {
        role: 'parent',
        registration_code: location.student_registration_code,
        locale: 'en',
        children: [{
          first_name: 'Martin Jr',
          last_name: 'Prince'
        }]
      })
      expect(response.status).to eq(401)
      expect(response_json).to have_key(:errors)
    end

    it 'creates and adds children to the location' do
      post_json("/v1/locations/#{location.id}/join-with-children", body: {
        role: RegisterAccount::PARENT,
        registration_code: location.student_registration_code,
        locale: 'en',
        children: [{
          first_name: 'Martin Jr',
          last_name: 'Prince'
        }]
      }, user: user)
      expect(user.children.first.first_name).to eq('Martin Jr')
      expect(user.children.first.last_name).to eq('Prince')
      expect(user.children.first.location_accounts.first.role).to eq(RegisterAccount::STUDENT)
      expect(user.children.first.location_accounts.first.location).to eq(location)

      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
    end

    it 'adds the user as a teacher, creates and adds children to the location' do
      post_json("/v1/locations/#{location.id}/join-with-children", body: {
        role: RegisterAccount::TEACHER,
        registration_code: location.registration_code,
        locale: 'en',
        children: [{
          first_name: 'Martin Jr',
          last_name: 'Prince'
        }]
      }, user: user)
      expect(user.location_accounts.first.role).to eq(RegisterAccount::TEACHER)
      expect(user.location_accounts.first.location).to eq(location)
      expect(user.children.first.first_name).to eq('Martin Jr')
      expect(user.children.first.last_name).to eq('Prince')
      expect(user.children.first.location_accounts.first.role).to eq(RegisterAccount::STUDENT)
      expect(user.children.first.location_accounts.first.location).to eq(location)

      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
    end

    it 'adds the user to the location even when no child is given' do
      post_json("/v1/locations/#{location.id}/join-with-children", body: {
        role: RegisterAccount::TEACHER,
        registration_code: location.registration_code,
        locale: 'en'
      }, user: user)
      expect(user.location_accounts.first.role).to eq(RegisterAccount::TEACHER)
      expect(user.location_accounts.first.location).to eq(location)
      expect(response_json.fetch(:data).fetch(:id)).to eq(user.id.to_s)
    end

    it 'fails when an incorrect registration code is used' do
      post_json("/v1/locations/#{location.id}/join-with-children", body: {
        role: RegisterAccount::TEACHER,
        registration_code: 'blah',
        locale: 'en'
      }, user: user)
      expect(response_json.fetch(:errors)[0].fetch(:title)).to eq('Invalid request')
    end

    it 'fails when a student registration code is used to join as a teacher' do
      post_json("/v1/locations/#{location.id}/join-with-children", body: {
        role: RegisterAccount::TEACHER,
        registration_code: location.student_registration_code,
        locale: 'en'
      }, user: user)
      expect(response_json.fetch(:errors)[0].fetch(:title)).to eq('Invalid request')
    end
  end

  describe 'swagger specs' do
    path '/v1/locations/:location_id' do
      get 'return the specified location' do
        produces 'application/json'
        response 200, 'Current user exists' do
          schema LocationSerializer::SWAGGER_SCHEMA

          before do |example|
            submit_request(example.metada)
          end
        end
      end
    end
  end
end
