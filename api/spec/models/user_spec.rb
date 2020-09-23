# == Schema Information
#
# Table name: users
#
#  id                                 :uuid             not null, primary key
#  accepted_terms_at                  :datetime
#  auth_token                         :text
#  auth_token_set_at                  :datetime
#  birth_date                         :date
#  completed_welcome_at               :datetime
#  current_sign_in_at                 :datetime
#  current_sign_in_ip                 :inet
#  email                              :text
#  email_confirmation_sent_at         :datetime
#  email_confirmation_token           :text
#  email_confirmed_at                 :datetime
#  email_unconfirmed                  :text
#  first_name                         :text             not null
#  is_sms_gateway_emailable           :boolean
#  language                           :text             default("en"), not null
#  last_name                          :text             not null
#  last_sign_in_at                    :datetime
#  last_sign_in_ip                    :inet
#  magic_sign_in_sent_at              :datetime
#  magic_sign_in_token                :text
#  mobile_carrier                     :text
#  mobile_number                      :text
#  mobile_number_confirmation_sent_at :datetime
#  mobile_number_confirmation_token   :text
#  mobile_number_confirmed_at         :datetime
#  mobile_number_unconfirmed          :text
#  password_digest                    :text
#  password_reset_sent_at             :datetime
#  password_reset_token               :text
#  password_set_at                    :datetime
#  physician_name                     :text
#  physician_phone_number             :text
#  sign_in_count                      :integer          default(0), not null
#  zip_code                           :text
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#
# Indexes
#
#  index_users_on_auth_token                        (auth_token) UNIQUE
#  index_users_on_email                             (email) UNIQUE
#  index_users_on_email_confirmation_token          (email_confirmation_token) UNIQUE
#  index_users_on_magic_sign_in_token               (magic_sign_in_token) UNIQUE
#  index_users_on_mobile_number                     (mobile_number) UNIQUE
#  index_users_on_mobile_number_confirmation_token  (mobile_number_confirmation_token)
#  index_users_on_password_reset_token              (password_reset_token) UNIQUE
#
require 'rails_helper'

RSpec.describe User, type: :model do
  it "has parent/child relationships" do
    parent = Fabricate(:user)
    child = Fabricate(:user)
    parent.children << child

    parent.save

    expect(User.find(parent.id).children.include?(child)).to eq(true)
    expect(User.find(child.id).parents.include?(parent)).to eq(true)
  end
  
  it "has todays greenlight status" do
    user = Fabricate(:user)
    gl_status = Fabricate.build(:greenlight_status)
    gl_status.user = user
    gl_status.created_by_user = user
    gl_status.save

    status = GreenlightStatus.submitted_today.where(user: user).first
    expect(status.status).to eq(gl_status.status)
    expect(user.last_greenlight_status.status).to eq(gl_status.status)
    expect(user.todays_greenlight_status.status).to eq(gl_status.status)
  end
end
