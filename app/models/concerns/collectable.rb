# frozen_string_literal: true
module Collectable
  extend ActiveSupport::Concern

  included do
    alias_method :archive!, :collect!
  end

  def collect!; end
end
