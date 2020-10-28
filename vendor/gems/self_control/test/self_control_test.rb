require "test_helper"

class SelfControlTest < Minitest::Test
  def test_that_it_has_a_version_number
    refute_nil ::SelfControl::VERSION
  end

  def test_open_close_trace
    t = SelfControl::Trace.new()
    t.open()
    t.close()
    assert t.root.is_a?(SelfControl::Branch)
    assert t.root.children.is_a?(Array)
    assert t.root.children[0].is_a?(SelfControl::Branch)
    assert t.root.children.size == 1
  end

  def test_open_close_reopen_close_trace
    t = SelfControl::Trace.new()
    t.open()
    t.close()
    t.reopen()
    t.close()
    assert t.root.is_a?(SelfControl::Branch)
    assert t.root.children.is_a?(Array)
    assert t.root.children[0].is_a?(SelfControl::Branch)
    assert t.root.children.size == 1
  end

  def test_scenario_1
    options = {
      craving_ice_cream: true,
      sunny: false,
      cloudy: true,
      ice_cream_truck: true,
      has_good_flavor: true,
      hot: true,
      hands_are_too_sweaty: false
    }
    e = Example.new(options)
    assert_equal :craving_ice_cream, e.dsl.result
    assert_equal :craving_ice_cream, e.manual
  end

  def test_scenario_2
    options = {
      craving_ice_cream: false,
      sunny: false,
      cloudy: true,
      ice_cream_truck: true,
      has_good_flavor: true,
      hot: true,
      hands_are_too_sweaty: false
    }
    e = Example.new(options)
    assert_equal :truck_has_flavor, e.dsl.result
    # assert_equal :truck_has_flavor, e.manual

    # puts
    # puts(e.dsl.to_s)
    # puts
  end

  def test_dsl_with_locals
    e = Example.new(craving_ice_cream: true)
    trace, apples = e.dsl_with_locals
    assert_equal [1, 2], apples
    # puts
    # puts(trace.to_s)
    # puts
  end

  def test_operators
    flow = SelfControl::Flow.new(self) do
      If(Cond(true) & Cond(true) & Cond(true)) {
        Return(true)
      }.Else {
        Return(false)
      }
    end
    assert_equal true, flow.result

    flow = SelfControl::Flow.new(self) do
      If(Cond(true) & Cond(true) & Cond(false)) {
        Return(true)
      }.Else {
        Return(false)
      }
    end
    puts
    puts flow.trace.to_s
    puts
    assert_equal false, flow.result


    flow = SelfControl::Flow.new(self) do
      If(Cond(true) | Cond(false) & Cond(false)) {
        Return(true)
      }.Else {
        Return(false)
      }
    end
    puts
    puts flow.trace.to_s
    puts
    assert_equal false, flow.result
  end
end
