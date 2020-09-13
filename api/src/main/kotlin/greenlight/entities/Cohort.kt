package greenlight.entities
import io.micronaut.core.annotation.Introspected
import java.util.*
import javax.persistence.Entity
import javax.persistence.Table
import javax.validation.constraints.NotBlank

@Introspected
@Entity
@Table(name = "cohorts")
class Cohort : AbstractBase() {
    @NotBlank
    var name : String? = null
    @NotBlank
    var category : String? = null
    var locationId : UUID? = null
}
