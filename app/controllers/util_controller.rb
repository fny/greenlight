# frozen_string_literal: true
module UtilController
  extend ActiveSupport::Concern

  included do
    get '/v1/util/email-taken', auth: false do
      if params[:email].blank?
        simple_error_response({
          status: '422',
          source: { parameter: 'email' },
          title: 'Missing Parameter',
          detail: 'You need to provide an email'
        })
      else
        render json: {
          taken: User.email_taken?(params[:email])
        }
      end
    end

    get '/v1/util/mobile-taken', auth: false do
      if params[:mobile].blank?
        simple_error_response({
          status: '422',
          source: { parameter: 'mobile' },
          title: 'Missing Parameter',
          detail: 'You need to provide a mobile number'
        })
      else
        render json: {
          taken: User.mobile_taken?(params[:mobile])
        }
      end
    end

    get '/v1/util/email-or-mobile-taken', auth: false do
      if params[:value].blank?
        simple_error_response({
          status: '422',
          source: { parameter: 'email' },
          title: 'Missing Parameter',
          detail: 'You need to provide an email or mobile number'
        })
      else
        render json: {
          taken: User.email_or_mobile_taken?(params[:value])
        }
      end
    end

    get '/v1/util/handle-taken', auth: false do
      if params[:handle].blank?
        simple_error_response({
          status: '422',
          source: { parameter: 'handle' },
          title: 'Missing Parameter',
          detail: 'You need to provide a URL handle'
        })
      else
        render json: {
          taken: Location.handle_taken?(params[:handle])
        }
      end
    end
  end
end
