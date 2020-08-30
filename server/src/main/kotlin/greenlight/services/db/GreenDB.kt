package greenlight.services.db

import greenlight.services.db.person.PersonRepository
import javax.inject.Inject
import javax.sql.DataSource

class GreenDB {
  
  @Inject lateinit var dataSource : DataSource
  
}

