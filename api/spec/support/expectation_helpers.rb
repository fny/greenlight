module ExpectationHelpers
  def expect_work(worker)
    expect(worker.jobs.size).to eq(1)
    worker.drain
    expect(worker.jobs.size).to eq(0)
  end


  def expect_success_json
    expect(response_json).to eq({ 'success' => true })
  end
end
