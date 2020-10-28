module SelfControl
  class Branch
    # @return [String, nil]
    attr_reader :info
    # @return [Array<Condition>]
    attr_reader :conditions
    # @return [Branch, nil]
    attr_reader :parent
    # @return [Array<Branch>]
    attr_reader :children
    
    # @param parent [Branch, nil]
    # @param info [String]
    def initialize(parent, info)
      @parent = parent
      @info = info
      @conditions = []
      @children = []
    end

    # @param info [String]
    def add_child(info)
      child = Branch.new(self, info)
      self.children.push(child)
      child
    end
  end
end
