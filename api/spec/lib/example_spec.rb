require 'spec_helper'



RSpec.describe "Array", order: :defined do
  before(:context) do
    @array = []
  end

  describe "initialized in before(:context)" do
    it "has 0 widgets" do
      expect(@array.size).to eq(0)
    end

    it "accepts objects" do
      @array << Object.new
    end

    it "shares state across examples" do
      expect(@array.size).to eq(1)
    end

    it "can reassign the array" do
      @array = []
    end

    it "still shares state across examples" do
      expect(@array.count).to eq(0)
    end
  end
end
