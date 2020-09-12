package greenlight.entities
import java.util.*
import javax.validation.constraints.NotBlank

class Cohorts : AbstractBase() {
    @NotBlank
    var name : String? = null
    @NotBlank
    var category : String? = null
    var locationId : UUID? = null
}
