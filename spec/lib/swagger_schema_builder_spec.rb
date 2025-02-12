require 'rails_helper'
RSpec.describe SwaggerSchemaBuilder do
  it 'models a swagger schema concisely' do
    schema = SwaggerSchemaBuilder.build do
      firstName :string, required: true
      lastName :string
      car(required: true) {
        make :string, required: true
        model :string
        year :number
      }
    end

    expect(schema).to eq({
      type: :object,
      properties: {
        firstName: { type: :string },
        lastName: { type: :string },
        car: {
          type: :object,
          properties: {
            make: { type: :string },
            model: { type: :string },
            year: { type: :number }
          },
          required: ['make']
        }
      },
      required: %w[firstName car]
    })
  end
end
