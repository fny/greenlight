-- Greenlight
select
  u.id as user_id,
  u.first_name,
  u.last_name,
  g.status,
  u.email,
  u.mobile_number,
  g.submission_date,
  g.expiration_date,
  g.follow_up_date
from
  users u,
  locations l,
  location_accounts la,
  greenlight_statuses g,
  parents_children pc
where
  l.permalink = 'wg-pearson'
  and l.id = la.location_id
  and u.id = la.user_id
  and pc.child_id = u.id
order by
  submission_date;
