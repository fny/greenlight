class Configurator
  # target - the module/class on which to append the constants
  def intialize(target, &block)
    self.target
    self.constants = {}
    instance_eval(&block)
  end

  def set(name, value = nil, &block)
    constants[name] = value || block.call
    self.target.const_set(name, value)
  end

  def env(name, value = nil, required: true, default: nil)
    value = ENV[name.to_s] || default
    if value.blank? && required
      raise MissingEnvironmentVariable.new(name)
    end
    set(name, value)
  end

  class MissingEnvironmentVariable < StandardError
    def initialize(var_name)
      super("Expected #{var_name} to be set.")
    end
  end
end
