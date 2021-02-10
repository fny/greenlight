require 'rails_helper'

RSpec.describe EmailOrPhone do
  it 'validates an email' do
    em = EmailOrPhone.new('test@email.com')
    expect(em.valid?).to eq(true)
    expect(em.invalid?).to eq(false)
    expect(em.email?).to eq(true)
    expect(em.phone?).to eq(false)
    expect(em.value).to eq('test@email.com')
  end

  it 'validates a phone in the US' do
    em = EmailOrPhone.new('4073303271')
    expect(em.valid?).to eq(true)
    expect(em.invalid?).to eq(false)
    expect(em.email?).to eq(false)
    expect(em.phone?).to eq(true)
    expect(em.value).to eq('+14073303271')
  end

  it 'validates a phone from Puerto Rico' do
    em = EmailOrPhone.new('7873303271')
    expect(em.valid?).to eq(true)
    expect(em.invalid?).to eq(false)
    expect(em.email?).to eq(false)
    expect(em.phone?).to eq(true)
    expect(em.value).to eq('+17873303271')
  end

  it 'validates a phone from Canada' do
    em = EmailOrPhone.new('2043303271')
    expect(em.valid?).to eq(true)
    expect(em.invalid?).to eq(false)
    expect(em.email?).to eq(false)
    expect(em.phone?).to eq(true)
    expect(em.value).to eq('+12043303271')
  end

  it 'rejects nonsense' do
    em = EmailOrPhone.new('asdfasdf')
    expect(em.valid?).to eq(false)
    expect(em.invalid?).to eq(true)
    expect(em.email?).to eq(false)
    expect(em.phone?).to eq(false)
    expect(em.value).to eq('asdfasdf')
  end

  it 'rejects invalid numbers' do
    em = EmailOrPhone.new('5553334444')
    expect(em.valid?).to eq(false)
    expect(em.invalid?).to eq(true)
    expect(em.email?).to eq(false)
    expect(em.phone?).to eq(true)
    expect(em.value).to eq('+15553334444')
  end
end
