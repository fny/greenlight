# TODO
class GLError
  attr_accessor :code, :source, :title, :detail

  def initialize(code: '', source: '', title: '', detail: '')
    attributes = CODES[code]
    if attributes.nil?
      Rails.logger.warn("No error code found for error #{code} #{detail}")
    end
  end

  def to_h

  end

  def to_json

  end

  CODES = {}
end
