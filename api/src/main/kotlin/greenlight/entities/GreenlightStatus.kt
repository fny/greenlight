package greenlight.entities

import io.micronaut.core.annotation.Introspected
import java.time.Instant
import java.util.*
import javax.persistence.Entity
import javax.persistence.PrePersist
import javax.persistence.Table
import javax.validation.constraints.NotBlank






@Introspected
@Entity
@Table(name = "greenlight_statuses")
class GreenlightStatus : AbstractBase() {
    enum class Statuses(val status: String) {
        RED("red"),
        YELLOW("yellow"),
        GREEN("green"),
        ABSENT("green"),
        UNKNOWN("unknown"),
    }

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

    @PrePersist
    fun onPersist() {
        createdAt = Instant.now()
    }

}
