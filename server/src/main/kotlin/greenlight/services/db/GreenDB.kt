package greenlight.services.db

import javax.inject.Inject
import javax.sql.DataSource

class GreenDB {
  
  @Inject lateinit var dataSource : DataSource
  
}

