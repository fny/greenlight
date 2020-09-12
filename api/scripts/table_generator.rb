require 'pp'
require 'erb'

require 'time'

class Turtle
  attr_reader :definitions

  def self.table(&block)
    table = self.new {
      set :table_name, :value
      collect :column, :name, :type, nullable: true, index: false, default: nil, unique: false, references: nil
      collect :index, :table, columns: [], unique: false, name: nil
      collect :relationship, :name, :type, nullable: true
    }
    table.instance_eval(&block)
    table
  end

  def initialize(&block)
    @definitions = {}
    if block_given?
      instance_eval(&block)
    end
  end

  def read
    struct = Struct.new('Data' + Random.new.rand(100000).to_s, *@definitions.keys)
    result = struct.new
    @definitions.each { |key, definition|
      result[key] = definition[:value]
    }
    return result
  end

  def collect(key, *defined_members, **defaults)
    members = [defined_members, defaults.keys].flatten
    define(key, Array, members, defaults)
  end

  def set(key, *defined_members, **defaults)
    members = [defined_members, defaults.keys].flatten
    define(key, Struct, members, defaults)
  end

  private

  def define(key, value_type, members, defaults)
    name = key.to_s.split('_').collect(&:capitalize).join()
    @definitions[key] = {
      name: name,
      defaults: defaults,
      struct: ::Struct.new(name + Random.new.rand(100000).to_s, *members),
      value: value_type == Array ? [] : nil
    }

    define_singleton_method(key) do |*args, **options, &block|
      definition = @definitions[key]
      struct = definition[:struct]
      value = struct.new(*args)
      definition[:defaults].each { |k, v| value[k] = v if !value[k] }
      options.each { |k, v| value[k] = v }
      if definition[:value].is_a?(Array)
        definition[:value].push(value)
      else
        definition[:value] = value
      end
    end
  end
end


class Template
  attr_reader :table

  def initialize(table)
    @table = table
  end

  def render_sql()
    ERB.new(SQL_TEMPLATE, trim_mode: '-').result(binding)
  end

  def render_kt()
    ERB.new(KT_TEMPLATE, trim_mode: '-').result(binding)
  end

  def iff(test, value)
    return value if test
  end

  def downcase_first_letter(str)
    str[0].downcase + str[1..-1]
  end

  def classify(snake_case)
    snake_case.to_s.split('_').collect(&:capitalize).join()
  end

  def camel_case(snake_case)
    one = snake_case.to_s.split('_').collect(&:capitalize).join()
    one[0] = one[0].downcase
    one
  end

  def sql_type(value)
    {
      string: 'text',
      timestamp: 'timestamp',
      boolean: 'boolean',
      uuid: 'uuid'
    }.fetch(value.to_sym)
  end

  def kt_type(value)
    {
      string: 'String',
      timestamp: 'Instant',
      boolean: 'Boolean',
      uuid: 'UUID'
    }.fetch(value.to_sym)
  end


  SQL_TEMPLATE =<<-'SQL'
CREATE TABLE <%= table.table_name.value %> (
<% table.column.each_with_index do |c, i| -%>
<% if c.name == :id -%>
    id uuid primary key default uuid_generate_v4(),
<% else -%>
    <%= c.name %> <%= sql_type(c.type) %><%= iff(c.references, " references #{c.references}") %><%= iff(!c.nullable, ' not null') %><%= iff(c.unique, ' unique') %><%= iff(c.default, "default #{c.default}") %><%= i == table.column.size - 1 ? '' : ',' %>
<% end -%>
<% end -%>
);
<% if table.column.map(&:name).include?(:updated_at) -%>
CREATE TRIGGER <%= table.table_name.value %>_updated_at_moddatetime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime(updated_at);
<% end -%>
<% table.column.filter { |c| c.index }.each do |c| -%>

CREATE INDEX <%="#{table.table_name.value}_#{c.name}_idx"  %> ON <%= table.table_name.value %>(<%= c.name %>);
<% end -%>
<% table.index.each do |i| -%>

CREATE <%= iff(i.unique, 'unique ') %>INDEX <%= i.name || "#{table.table_name.value}_#{i.columns.join('_')}_idx"  %> ON <%= table.table_name.value %>(<%= i.columns.join(', ') %>);
<% end -%>
SQL

  KT_TEMPLATE=<<-'KT'
class <%= classify(table.table_name.value) %> : AbstractBase {
<% table.column.each do |c| -%>
<% next if c.name == :id -%>
<%= iff(!c.nullable, "    @NotBlank\n") -%>
<%= iff(c.unique, "    @Column(unique = true)\n") -%>
    var <%= camel_case(c.name) %> : <%= kt_type(c.type) %>? = null
<% end -%>
}
KT
end

def render(table)
  puts "========================"
  puts table.table_name.value
  puts Time.now.utc.iso8601.gsub(':', '')
  puts
  puts "+++ SQL +++"
  puts
  puts Template.new(table).render_sql
  puts
  puts "+++ KOTLIN +++"
  puts
  puts Template.new(table).render_kt
end



locations = Turtle.table do
  table_name 'locations'
  column :id, :uuid
  column :name, :string, nullable: false
  column :category, :string, index: true
  column :permalink, :string, nullable: false, unique: true
  column :phone_number, :string
  column :email_address, :string
  column :zip_code, :string
  column :hidden, :boolean, default: false

  column :created_at, :timestamp, default: 'now()', nullable: false
  column :updated_at, :timestamp, default: 'now()', nullable: false
end



location_accounts = Turtle.table do
  table_name 'location_accounts'
  column :id, :uuid
  column :user_id, :uuid, references: 'user(id) on delete cascade'
  column :location_id, :uuid, references: 'location(id) on delete cascade'
  column :role, :string, nullable: false, index: true
  column :attendance_status, :string
  column :user_approved_at, :timestamp
  column :location_approved_at, :timestamp
  column :created_at, :timestamp, default: 'now()', nullable: false
  column :updated_at, :timestamp, default: 'now()', nullable: false
end


greenlight_statuses = Turtle.table do
  table_name 'greenlight_statuses'
  column :id, :uuid
  column :user_id, :uuid, references: 'user(id) on delete cascade'
  column :location_id, :uuid, references: 'location(id) on delete cascade'
  column :status, :string, nullable: false, index: true
  column :status_set_at, :timestamp, nullable: false
  column :status_expires_at, :timestamp, nullable: false
  column :is_override, :boolean, nullable: false, default: false

  column :created_by_user_id, :uuid, references: 'user(id) on delete cascade'
  column :created_at, :timestamp, default: 'now()', nullable: false
end

medical_events = Turtle.table do
  table_name 'medical_events'
  column :event_type, :string, nullable: false, index: true
  column :occurred_at, :timestamp, nullable: false
  column :created_at, :timestamp, default: 'now()', nullable: false
end


cohorts = Turtle.table do
  table_name 'cohorts'
  column :id, :uuid
  column :name, :string
  column :category, :string, index: true
  column :location_id, :uuid, references: 'location(id) on delete cascade'
end

user_cohorts = Turtle.table do
  table_name 'user_cohorts'
  column :user_id, :uuid, references: 'user(id) on delete cascade'
  column :cohort_id, :uuid, references: 'user(id) on delete cascade'
end


render cohorts.read
