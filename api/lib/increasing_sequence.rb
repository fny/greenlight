class IncreasingSequence
  def initialize(start)
    @enum = Enumerator.new do |y|
      s = start
      loop do
        y << s
        s = s + 1
      end
    end
  end

  def method_missing(method, *args, &block)
    @enum.send(method, *args, &block)
  end
end
