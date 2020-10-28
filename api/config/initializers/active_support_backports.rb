module ActiveSupportBackports
  warn "[DEPRECATED] #{self} should no longer be needed. Please remove!" if Rails.version >= '6.0.4'

  def self.prepended(base)
    base.class_eval do
      delegate :hash, :instance_methods, :respond_to?, to: :target
    end
  end
end

module ActiveSupport
  class Deprecation
    class DeprecatedConstantProxy
      prepend ActiveSupportBackports
    end
  end
end
