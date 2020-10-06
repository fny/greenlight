$LOAD_PATH.unshift File.expand_path("../lib", __dir__)
require "self_control"

require 'minitest'
require 'minitest/autorun'
require 'minitest/autorun'
require 'minitest/pride'



class Example
  attr_reader :trace

  def initialize(h)
    h.each do |k, v|
      define_singleton_method("#{k}?") { v }
    end
  end

  def dsl
    SelfControl::Flow.new(self) do
      If(:craving_ice_cream?) {
        Return(:craving_ice_cream)
      }
      If(:sunny?) {
        Return(:sunny_ice_cream)
      }.Elsif(:cloudy?) {
        If(And(:ice_cream_truck?, :has_good_flavor?)) {
          Return(:truck_has_flavor)
        }
        If(:hot?) {
          Return(:hot_i_want_ice_cream)
        }.Else {
          If(:hands_are_too_sweaty?) {
            Return(:cant_hold_cone)
          }.Else {
            Return(:hot_and_i_want_it)
          }
        }
      }.Else {
        Return(:too_wet_for_ice_cream)
      }
    end
  end

  def dsl_with_locals
    apples = []
    flow = SelfControl::Flow.new(self) do
      apples.push(1)
      If(:craving_ice_cream?) {
        apples.push(2)
        Return(:craving_ice_cream)
      }
    end
    [flow, apples]
  end

  def manual
    t = SelfControl::Trace.new(self)
    t.open()
    if t.cond(:craving_ice_cream?, 'if')
      return :craving_ice_cream
    end
    t.close()

    t.open()
    if t.cond(:sunny?, 'if')
      return :sunny_ice_cream
    elsif t.cond(:cloudy?, 'elsif')
      t.open()
      if t.cond(->{ ice_cream_truck? && has_good_flavor?} , 'if')
        return :truck_has_flavor
      end
      t.close()

      t.open()
      if t.cond(:hot?)
        return :hot_i_want_ice_cream
      else
        t.open()
        if t.cond(:hands_are_too_sweaty?, 'if')
          return :cant_hold_cone
        else t.cond('else')
          return :hot_and_i_want_it
        end
        t.close()
      end
      t.close()
    else t.cond('else')
      return :too_wet_for_ice_cream
    end
    t.close()
  end
end
