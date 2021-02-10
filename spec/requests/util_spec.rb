require 'rails_helper'

RSpec.describe 'Utility endpoints', type: :request do
  path '/v1/util/email-taken' do
    it 'returns true when the email is taken' do
      user = Fabricate(:user)
      get_json "/v1/util/email-taken?email=#{user.email}"
      expect(response_json[:taken]).to eq(true)
    end

    it 'returns false when the email is not taken' do
      user = Fabricate(:user)
      user.destroy
      get_json "/v1/util/email-taken?email=#{user.email}"
      expect(response_json[:taken]).to eq(false)
    end

    get 'Returns whether the email is in use' do
      produces 'application/json'
      parameter name: :email, in: :query, type: :string

      response 200, 'Email provided' do
        schema(SwaggerSchemaBuilder.build { taken :boolean, required: true })

        let(:email) { Fabricate(:user).email }

        run_test!
      end

      response 422, 'Email not provided' do
        let(:email) { nil }

        run_test!
      end
    end
  end

  path '/v1/util/mobile-taken' do
    it 'returns true when the mobile number is taken' do
      user = Fabricate(:user)
      get_json "/v1/util/mobile-taken?mobile=#{user.mobile_number}"
      expect(response_json[:taken]).to eq(true)
    end

    it 'returns false when the mobile number is not taken' do
      user = Fabricate(:user)
      user.destroy
      get_json "/v1/util/mobile-taken?mobile=#{user.mobile_number}"
      expect(response_json[:taken]).to eq(false)
    end

    get 'Returns whether the mobile number is in use' do
      produces 'application/json'
      parameter name: :mobile, in: :query, type: :string

      response 200, 'Mobile number provided' do
        schema(SwaggerSchemaBuilder.build { taken :boolean, required: true })
        let(:mobile) { Fabricate(:user).email }
        run_test!
      end

      response 422, 'Mobile number not provided' do
        let(:mobile) { nil }
        run_test!
      end
    end
  end

  path '/v1/util/email-or-mobile-taken' do
    it 'returns true when the email or mobile number is taken' do
      user = Fabricate(:user)
      get_json "/v1/util/email-or-mobile-taken?value=#{user.mobile_number}"
      expect(response_json[:taken]).to eq(true)

      get_json "/v1/util/email-or-mobile-taken?value=#{user.email}"
      expect(response_json[:taken]).to eq(true)
    end

    it 'returns false when the email or mobile number is not taken' do
      user = Fabricate(:user)
      user.destroy

      get_json "/v1/util/email-or-mobile-taken?value=#{user.mobile_number}"
      expect(response_json[:taken]).to eq(false)

      get_json "/v1/util/email-or-mobile-taken?value=#{user.email}"
      expect(response_json[:taken]).to eq(false)
    end

    get 'Returns whether the email or mobile number is in use' do
      produces 'application/json'
      parameter name: :value, in: :query, type: :string

      response 200, 'Email or mobile number provided' do
        schema(SwaggerSchemaBuilder.build { taken :boolean, required: true })
        let(:value) { Fabricate(:user).email }
        run_test!
      end

      response 422, 'Email or mobile number not provided' do
        let(:value) { nil }
        run_test!
      end
    end
  end

  path '/v1/util/handle-taken' do
    it 'returns true when the handle is taken' do
      location = Fabricate(:location)
      get_json "/v1/util/handle-taken?handle=#{location.permalink}"
      expect(response_json[:taken]).to eq(true)
    end

    it 'returns false when the handle is not taken' do
      location = Fabricate(:location)
      location.destroy
      get_json "/v1/util/handle-taken?handle=#{location.permalink}"
      expect(response_json[:taken]).to eq(false)
    end

    get 'Returns whether the handle is in use' do
      produces 'application/json'
      parameter name: :handle, in: :query, type: :string

      response 200, 'Handle provided' do
        schema(SwaggerSchemaBuilder.build { taken :boolean, required: true })
        let(:handle) { Fabricate(:location).permalink }
        run_test!
      end

      response 422, 'Handle provided' do
        let(:handle) { nil }
        run_test!
      end
    end
  end
end
