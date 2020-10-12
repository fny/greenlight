class Configurator
  # target - the module/class on which to append the constants
  def initialize(target, &block)
    @target = target
    @constants = {}
    instance_eval(&block)
  end

  def set(name, value = nil, &block)
    @constants[name] = value || block.call
    @target.const_set(name, @constants[name])
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
      super("Expected #{var_name} to be set as an environment variable!")
    end
  end
end