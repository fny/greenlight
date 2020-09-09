package greenlight.models.db

import java.util.UUID
import javax.persistence.Transient

object Defaults {
     val User = User(UUID.fromString("fceadeea-f21a-11ea-adc1-0242ac120002"), "GREENLIGHT", "GREENLIGHT", "admin@greenlighted.org", "+12265000405")
}