package greenlight.models.db

import org.hibernate.annotations.Immutable
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import javax.persistence.UniqueConstraint

@Entity
@Immutable
@Table(name = "ZIPCODE",
      uniqueConstraints = [UniqueConstraint(columnNames = ["zip"])])
data class ZipCode(
        @Id
        val zip: String,
        val city: String,
        val state: String,
        val lat: Double,
        val lng: Double)