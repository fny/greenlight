# frozen_string_literal: true

class LocationsSummaryDownload < ApplicationCommand
  HEADERS = [
    'Location Id',
    'Name',
    'Permalink',
    'Category',
    'Role',
    'Role Count',
    'Status Count'
  ]
  def file_path
    Rails.root.join("tmp/locations-summary.xlsx")
  end

  def query
    @query ||= DB.query(<<~SQL)
      select
        l.id as location_id,
        l.name,
        l.permalink,
        l.category,
        r.role,
        r.role_count,
        r.status_count,
        DATE_PART('day', now() - l.created_at) as days_active
      from locations l
      join (
        select u.location_id, u.role, u.role_count , coalesce(g.status_count, 0) as status_count
        from (
          select la.location_id as location_id, la.role, count(la.role) as role_count
          from location_accounts la
          group by la.location_id, la.role
        ) as u
        left outer join (
          select l.id as location_id, la.role, count(gs.id) as status_count
          from locations l
          left outer join location_accounts la
          on l.id = la.location_id
          join greenlight_statuses gs
          on gs.user_id = la.user_id
          group by l.id, la.role
        ) as g
        on g.location_id = u.location_id and g.role = u.role
      ) as r
      on l.id = r.location_id
      order by location_id
    SQL
  end

  def work
    FileUtils.rm_f(file_path) if File.exist?(file_path)
    workbook = FastExcel.open(file_path)

    worksheet = workbook.add_worksheet('Location Summary')

    worksheet.append_row(HEADERS, workbook.bold_format)
    query.each do |q|
      row = [q.location_id, q.name, q.permalink, q.category, q.role, q.role_count, q.status_count, q.days_active]
      worksheet.append_row(row)
    end
    workbook.close
  end
end
