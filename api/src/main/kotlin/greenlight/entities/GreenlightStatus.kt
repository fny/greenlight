package greenlight.entities

import java.time.Instant
import java.util.*
import javax.validation.constraints.NotBlank

class GreenlightStatus : AbstractBase() {
    var userId : UUID? = null
    var locationId : UUID? = null
    @NotBlank
    var status : String? = null
    @NotBlank
    var statusSetAt : Instant? = null
    @NotBlank
    var statusExpiresAt : Instant? = null
    @NotBlank
    var isOverride : Boolean? = null
    var createdByUserId : UUID? = null
    @NotBlank
    var createdAt : Instant? = null
}
