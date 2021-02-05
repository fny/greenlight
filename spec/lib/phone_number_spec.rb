# frozen_string_literal: true
require 'rails_helper'

RSpec.describe PhoneNumber do
  describe '.looks_like_number?' do
    it "returns true when the phone number looks like a phone number superficially" do
      expect(PhoneNumber.looks_like_number?('12345678')).to eq(true)
    end
  end
  describe '.parse' do
    it "returns a phone number in the proper format" do
      expect(PhoneNumber.parse('12345678')).to eq('+12345678')
    end
  end

  describe '.valid?' do
    it "returns true when a phone umber is valid" do
      expect(PhoneNumber.valid?('4073132149')).to eq(true)
    end

    it "allows 555 numbers" do
      expect(PhoneNumber.valid?('4075552149')).to eq(true)
    end

    it "allows numbers from PR" do
      expect(PhoneNumber.valid?('7872211678')).to eq(true)
    end

    it "allows numbers from Canada" do
      expect(PhoneNumber.valid?('4132211678')).to eq(true)
    end
  end
  describe '.equal?' do
    it "is true when the two numbers are the same" do
      expect(PhoneNumber.equal?('+14073132149', '407-313-2149')).to eq(true)
    end
  end

  describe '.fivefivefive?' do
    it "is true when the two numbers are the same" do
      expect(PhoneNumber.fivefivefive?('4075552149')).to eq(true)
    end
  end

  describe '.random_number' do
    it "is valid" do
      expect(PhoneNumber.valid?(PhoneNumber.random_number)).to eq(true)
    end
  end
end
