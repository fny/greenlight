Location.seed(:permalink, {
  name: 'Greenwood Lakes High School',
  permalink: 'greenwood-lakes',
  email: 'help@glhs.org',
  phone_number: '+14073238891',
  zip_code: '32779',
  category: 'school',
  cohort_schema: {
    'Activities' => ['Soccer Team', 'Football Team'],
    'Grade' => %w[Freshman Sophomore Junior Senior]
  }
})
