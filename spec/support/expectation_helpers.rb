# frozen_string_literal: true
module ExpectationHelpers
  def expect_work(worker)
    expect(worker.jobs.size).to eq(1)
    worker.drain
    expect(worker.jobs.size).to eq(0)
  end


  def expect_success_response
    expect(response.status).to eq(204)
  end
end
