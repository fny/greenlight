# frozen_string_literal: true
servers = %w[rails sinatra syro roda hanami]

servers.each do |server|
  puts
  puts "====== HELLO WORLD: #{server}"
  puts `wrk -t12 -c100 -d30s http://localhost:3000/#{server}`
end

servers.each do |server|
  puts
  puts "====== REAL WORK: #{server}"
  puts `wrk -t12 -c100 -d30s http://localhost:3000/#{server}/user/66dce15f-b33d-4acb-9c03-62f30e95f52e`
end
