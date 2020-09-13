package greenlight.entities

import io.micronaut.core.annotation.Introspected
import java.time.Instant
import java.util.*
import javax.persistence.*
import javax.validation.constraints.NotBlank
@Introspected
@Entity
@Table(name = "medical_events")
class LocationAccount : AbstractBase() {
    // TODO: This needs to go into a file somewhere or in the UI only
    // Maybe even a seperate table.
    enum class Roles(val value: String) {
        STUDENT("student"),
        TEACHER("teacher"),
        STAFF("staff"),
    }

    @NotBlank
    var role : String? = null
    var attendanceStatus : String? = null

    /** What time did the user allow the location to access data? */
    var approvedByUserAt : Instant? = null
    /** What time did the location accept the users data? */
    var approvedbyLocationAt : Instant? = null

    var createdAt : Instant? = null
    var updatedAt : Instant? = null

    @OneToOne(targetEntity = User::class, fetch = FetchType.LAZY)
    var user: User? = null

    @OneToOne(targetEntity = Location::class, fetch = FetchType.LAZY)
    var location: Location? = null

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
