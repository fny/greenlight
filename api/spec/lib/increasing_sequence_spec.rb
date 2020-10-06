require 'rails_helper'

RSpec.describe IncreasingSequence do
  describe "#next" do
    it "increments" do
      seq = IncreasingSequence.new(10)
      expect(seq.next).to eq(10)
      expect(seq.next).to eq(11)
    end
  end
end
