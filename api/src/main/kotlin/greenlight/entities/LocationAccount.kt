package greenlight.entities

import java.time.Instant
import java.util.*
import javax.persistence.*
import javax.validation.constraints.NotBlank

class LocationAccount : AbstractBase() {
    @NotBlank
    var role : String? = null
    var attendanceStatus : String? = null

    /** What time did the user allow the location to access data? */
    var approvedByUserAt : Instant? = null
    /** What time did the location accept the users data? */
    var approvedbyLocationAt : Instant? = null

    var createdAt : Instant? = null
    var updatedAt : Instant? = null

    @OneToMany(targetEntity = LocationAccount::class, fetch = FetchType.LAZY)
    var locationAccounts: Set<LocationAccount> = HashSet<LocationAccount>()

    @ManyToMany(targetEntity = User::class, fetch = FetchType.LAZY)
    @JoinTable(name = "location_accounts",
            joinColumns = [JoinColumn(name = "location_id")],
            inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var users: Set<User> = HashSet<User>()

}
