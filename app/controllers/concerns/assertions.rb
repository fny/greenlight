module Assertions
  extend ActiveSupport::Concern

  UnauthorizedError = Class.new(StandardError)
  NotFoundError = Class.new(StandardError)
  ForbiddenError = Class.new(StandardError)

  def ensure_authenticated!
    return if current_user.present? && current_user.persisted?

    raise UnauthorizedError
  end

  def ensure_or_forbidden!
    raise ForbiddenError unless yield
  end

  def ensure_or_not_found!
    raise NotFoundError unless yield
  end

  included do
    rescue_from NotFoundError do
      response.status = 404 # Not Found
      render json: JSONAPI::Errors.serialize(JSONAPI::Errors::NotFound.new)
    end

    rescue_from UnauthorizedError do
      response.status = 401 # Unauthorized
      render json: JSONAPI::Errors.serialize(JSONAPI::Errors::Unauthorized.new)
    end

    rescue_from ForbiddenError do
      response.status = 403 # Forbidden
      render json: JSONAPI::Errors.serialize(JSONAPI::Errors::Forbidden.new)
    end
  end
end
