package greenlight.models.db

import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType.AUTO
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.persistence.OneToOne
import javax.persistence.Table
import javax.validation.constraints.NotNull

@Entity
@Table(name = "GREENLIGHT_STATUSES")
class GreenlightStatus {
     @Id @GeneratedValue(strategy = AUTO) @NotNull var id : Int? = null

     var status: String? = null
}
