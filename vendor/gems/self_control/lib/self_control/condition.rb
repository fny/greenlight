module SelfControl
  class Condition
    # @return [Boolean]
    attr_accessor :value
    
    # @return [String]
    attr_accessor :info

    # @return [Array<Condition>]
    attr_accessor :children

    # @return [Object]
    attr_reader :target

    # @param condition [String, Boolean, Symbol, Condition]
    # @param target [Object] object on which the condition will be evaluated
    # @param info [String] details for debugging
    # @param children [Array<Condition>]
    def initialize(condition, target, info: nil, children: [])
      @target = target
      case condition
      when String
        @info = condition
        @value = eval(condition, target.send(:binding))
      when TrueClass, FalseClass
        @info = 'boolean'
        @value = condition
      when Symbol
        @info = condition.to_s
        @value = target.send(condition)
      when Condition
        @info = condition.info
        @value = condition.value
      else
        throw "Don't know how to handle #{condition}"
      end
      @info = "#{info}: #{@info}" if info
      @children = children
    end

    def &(other)
      resulted = [self, other]
      Condition.new(
        resulted.map(&:value).all?,
        self.target,
        info: '&',
        children: resulted
      )
    end

    def |(other)
      resulted = [self, other]
      Condition.new(
        resulted.map(&:value).any?,
        self.target,
        info: '|',
        children: resulted
      )
    end

    def to_s
      "#{info} => #{value}"
    end
  end
end
