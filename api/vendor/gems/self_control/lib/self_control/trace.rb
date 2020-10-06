require 'self_control/branch'

module SelfControl
  class Trace
    attr_reader :root
    
    def initialize(target = self)
      @target = target
      @root = Branch.new(nil, 'root')
      @curr = @root
    end

    def cond(condition, info = nil)
      if condition.is_a?(Condition)
        condition.info = [info, condition.info].compact.join(' ')
      else
        condition = Condition.new(condition, @target, info: info)
      end
      @curr.conditions.push(condition)
      condition
    end

    def open(info = nil)
      @curr = @curr.add_child(info)
    end

    def reopen()
      @curr = @curr.children.last
    end

    def at_root?
      @curr.parent.nil?
    end

    def close
      raise "Can't close the root" if at_root?
      @curr = @curr.parent
    end

    def to_s
      TracePrinting.print(@root)
    end
  end

  module TracePrinting
    # @param cond [Condition]
    # @param depth [Integer]
    def print_condition(cond, depth = 0, index = 0, padding = 0)
      prefix = ' ' * padding
      output = "#{prefix}#{cond.to_s}"
      if cond.children.any?
        output << "\n"
        output << cond.children.map.with_index { |c, i| 
          print_condition(c, depth + 1, i, padding + 2)
        }.join("\n")
      end
      output
    end

    # @param branch [Branch]
    # @param depth [Integer]
    def print(branch, depth = 0, index = 0, padding = 0)
      spacing = ' ' * padding
      output = ''
      if branch.info
        output << spacing << branch.info << ":"
      else
        output << spacing << "branch #{depth}.#{index}" << ":"
      end
      
      
      conds = branch.conditions.map.with_index { |c, i|
        print_condition(c, 0, i, padding + 2)
      }
      if conds.any?
        output << "\n" << conds.join("\n")
      end
      
      if branch.children.any?
        output << "\n" << branch.children.map.with_index { |c, i|
          print(c, depth + 1, i, padding + 2) 
        }.join("\n")
      end
      output
    end

    module_function :print, :print_condition
  end
end
