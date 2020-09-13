package greenlight.entities

import greenlight.etc.Phone
import io.micronaut.core.annotation.Introspected
import java.time.Instant
import javax.persistence.*
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
@Introspected
@Entity
@Table(name = "locations")
class Location : AbstractBase() {
    enum class Categories(val value: String) {
        SCHOOL("school")
    }
    @NotBlank
    var name : String? = null
    @NotBlank
    @Column(unique = true)
    var permalink : String? = null
    @NotBlank
    var category: String? = null
    @Phone
    var phoneNumber : String? = null
    @Email
    var email : String? = null
    var zipCode : String? = null
    var hidden : Boolean = false

    var createdAt : Instant? = Instant.now()
    var updatedAt : Instant? = Instant.now()

    @OneToMany(targetEntity = LocationAccount::class, fetch = FetchType.LAZY)
    var locationAccounts: Set<LocationAccount> = HashSet()

    @ManyToMany(targetEntity = User::class, fetch = FetchType.LAZY)
    @JoinTable(name = "location_accounts",
            joinColumns = [JoinColumn(name = "location_id")],
            inverseJoinColumns = [JoinColumn(name = "user_id")]
    )
    var users: Set<User> = HashSet()

    @PrePersist
    fun onPersist() {
        updatedAt = Instant.now()
        createdAt = updatedAt
    }

    @PreUpdate
    fun onUpdate() {
        updatedAt = Instant.now()
    }

    private fun formatPermalink() {
        if (this.permalink == null) {
            this.permalink = this.name
        }
        if (this.permalink == null) return
        this.permalink = this.permalink!!.toLowerCase()
            .replace(" ", "-")
            .replace("[^A-z0-9-]".toRegex(), "")
    }
}
