require 'optionparser'
require 'set'

printers = Array.new

s = Set.new(%w[commonjs mobile admin])
from = 'commonjs'
force = false

locations = {
  'admin' => 'admin/src/common',  
  'mobile' => 'mobile/src/common',
  'commonjs' => 'commonjs'
}

OptionParser.new do |opts|
  opts.on("-f", "--from PACKAGE", String, "File extension filters") do |package|
    from = package
  end

  opts.on("-f", "--force", "Actually run the transfer") do |run|
    force = true
  end
end.parse!

if !s.include?(from)
  raise "Unknown package #{from}"
end
s.delete(from)

from_location = locations.fetch(from)

def puts_dashed(lines)
  lines.split("\n").each do |line|
    puts " - #{line}"
  end
end

if force
  s.each do |package|
    to_location = locations.fetch(package)
    puts "Copying #{from_location} to #{to_location}"
    puts_dashed `rm -Rf #{to_location}`
    puts_dashed `cp -R #{from_location} #{to_location}`
  end  
else
  puts "Copying #{from_location}"
  puts_dashed `ls -l #{from_location}`
  s.each do |package|
    to_location = locations.fetch(package)
    puts "Copying #{from_location} to #{to_location}"
    puts_dashed `ls -l #{to_location}`
  end
end
