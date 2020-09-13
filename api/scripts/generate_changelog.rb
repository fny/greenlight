require 'erb'

RESOURCE_PATH = 'src/main/resources/'
BASE_PATH = 'src/main/resources/db/migrations/'


TEMPLATE=<<-YAML
databaseChangeLog:
<% paths.sort.each do |path| -%>
  - changeSet:
      id: <%= File.basename(path) %>
      author: greenlight
      changes:
      - sqlFile:
          path: <%= path.gsub(RESOURCE_PATH, '') %>
<% end -%>
YAML

class Render
  def paths
    Dir.glob("#{BASE_PATH}*.sql")
  end
  def render
    ERB.new(TEMPLATE, trim_mode: '-').result(binding)
  end
end



File.open("#{RESOURCE_PATH}db/liquibase-changelog.yml", "w") do |f|
  f.puts Render.new.render
end


