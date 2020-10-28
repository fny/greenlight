# frozen_string_literal: true
class MedicalEventSerializer < ApplicationSerializer
  attributes :event_type, :occurred_at
end
