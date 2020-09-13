package greenlight.entities
import io.micronaut.core.annotation.Introspected
import java.time.Instant
import java.util.*
import javax.persistence.Entity
import javax.persistence.PrePersist
import javax.persistence.PreUpdate
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

    var createdAt : Instant? = null
    var updatedAt : Instant? = null


    @PrePersist
    fun onPersist() {
        updatedAt = Instant.now()
        createdAt = updatedAt
    }

    @PreUpdate
    fun onUpdate() {
        updatedAt = Instant.now()
    }
}
