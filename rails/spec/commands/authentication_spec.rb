require 'rails_helper'

RSpec.describe Authentication do
  it "works" do
    expect(Authentication.attributes).to eq [:first_name]
  end
end
