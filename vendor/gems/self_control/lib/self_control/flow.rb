require 'self_control/trace'

module SelfControl
  class Flow
    # module Refinements
    #   refine Symbol do
    #     def |(other)
          
    #     end
    #   end
    # end
    # using Refinements
    
    NoReturnError = Class.new(StandardError)

    # @return [Trace]
    attr_reader :trace

    # @param target [Object]
    def initialize(target, &block)
      @target = target
      @trace = Trace.new(target)
      @return_value = nil
      @returned = false
      instance_eval(&block)
    end
    
    def method_missing(method, *args, &block)
      @target.send method, *args, &block
    end

    # @param condition [String, Boolean, Proc, Symbol, Condition]
    # @param info [String, nil]
    def If(condition, info = nil, &block)
      return self if returned?
      @trace.open()
      cond = @trace.cond(condition, concat('if', info))
      block.call if cond.value
      @trace.close()
      self
    end

    # @param condition [String, Boolean, Proc, Symbol, Condition]
    # @param info [String, nil]
    def Elsif(condition, info = nil, &block)
      return self if returned?
      @trace.reopen()
      cond = @trace.cond(condition, concat('elsif', info))
      block.call if cond.value
      @trace.close()
      self
    end

    # @param info [String, nil]
    def Else(info = nil, &block)
      return self if returned?
      @trace.reopen()
      cond = @trace.cond(true, concat('else', info))
      block.call if cond.value
      @trace.close()
      self
    end

    # @param conditions [Array<String, Boolean, Proc, Symbol, Condition>]
    # @param info [String, nil]
    # @return [Condition]
    def And(*conditions, info: nil)
      resulted = conditions.map { |c| Condition.new(c, @target) }
      Condition.new(
        resulted.map(&:value).all?,
        @target,
        info: info || 'and',
        children: resulted
      )
    end

    # @param conditions [Array<String, Boolean, Proc, Symbol, Condition>]
    # @param info [String, nil]
    # @return [Condition]
    def Or(*conditions, info: nil)
      resulted = conditions.map { |c| Condition.new(c, @target) }
      Condition.new(
        resulted.map(&:value).any?,
        @target,
        info: info || 'or',
        children: resulted
      )
    end

    # @param condition [String, Boolean, Proc, Symbol, Condition]
    # @param info [String, nil]
    # @return Condition
    def Not(condition, info = nil)
      resulted = Condition.new(condition, @target)
      Condition.new(
        !resulted.value,
        @target,
        info: "not(#{resulted.info})",
        children: [resulted]
      )
    end

    def Cond(condition, info = nil)
      Condition.new(condition, @target, info: info)
    end

    # @param value [Object]
    def Return(value = nil)
      return if @returned
      @returned = true
      @return_value = value
    end

    # @return [Boolean]
    def returned?
      @returned
    end

    # @return [Object]
    def result
      raise(NoReturnError.new("Nothing returned.")) if !returned?
      return @return_value
    end

    # @return [String]
    def to_s
      output = @trace.to_s
      if returned?
        output << "\nResult: #{result.to_s}"
      end
      output
    end

    private

    def concat(*args)
      args.compact.map(&:to_s).join(' ')
    end
  end
end
