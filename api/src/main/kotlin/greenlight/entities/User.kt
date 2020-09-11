package greenlight.entities

import greenlight.etc.BCryptPasswordService
import greenlight.etc.Util
import io.micronaut.core.annotation.Introspected
import java.time.Instant
import java.util.Date

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.JoinColumn
import javax.persistence.JoinTable
import javax.persistence.ManyToMany
import javax.persistence.OneToOne
import javax.persistence.PrePersist
import javax.persistence.PreUpdate
import javax.persistence.Table
import javax.validation.constraints.Email
import javax.validation.constraints.Max
import javax.validation.constraints.Min
import javax.validation.constraints.NotBlank

@Introspected
@Entity
@Table(name = "users")
class User : AbstractBase() {

    //region basic
    @NotBlank var firstName : String? = null
    @NotBlank var lastName : String? = null
    //endregion

    //region authentication
    var passwordDigest : String? = null
    var passwordSetAt : Instant? = null
    @Column(unique = true)
    var passwordResetToken : String? = null
    var passwordResetSentAt : Instant? = null
    @Column(unique = true)
    var authToken : String? = null
    var authTokenSetAt : Instant? = null
    //endregion

    //region email
    @Email var email : String? = null
    var emailConfirmationToken : String? = null
    var emailConfirmationSentAt : Instant? = null
    var emailConfirmedAt : Instant? = null
    @Email var emailUnconfirmed : String? = null
    //endregion

    //region mobile
    var mobileNumber : String? = null
    var mobileCarrier : String? = null
    var isSmsGatewayEmailable = false
    var mobileNumberConfirmationToken : String? = null
    var mobileNumberConfirmationSentAt : Instant? = null
    var mobileNumberConfirmedAt : Instant? = null
    var mobileNumberUnconfirmed : String? = null
    //endregion

    //region user details
    var zipCode : String? = null
    @Min(0) @Max(2) var gender : Int? = null
    var ethnicity : String? = null
    var birthDate : Date? = null
    var physicianName : String? = null
    var physicianPhoneNumber : String? = null
    //endregion

    //region useful timestamps
    var acceptedTermsAt : Instant? = null
    var reviewedAt : Instant? = null
    var firstSurveyAt: Instant? = null
    var createdAt : Instant? = null
    var updatedAt : Instant? = null
    //endregion

    //region tracking
    @Min(0)
    var signInCount : Int? = null
    var seenAt : Instant? = null
    var currentSignInAt : Instant? = null
    var lastSignInAt : Instant? = null
    var currentSignInIp: String? = null
    var lastSignInIp : String? = null
    var currentUserAgent : String? = null
    var lastUserAgent : String? = null
    //endregion

    //region relationships
    @ManyToMany(targetEntity = User::class, fetch = FetchType.EAGER)
    @JoinTable(name = "parents_children",
            joinColumns = [JoinColumn(name = "parent_user_id")],
            inverseJoinColumns = [JoinColumn(name = "child_user_id")]
    )
    var children: Set<User> = HashSet<User>()

    @ManyToMany(targetEntity = User::class, fetch = FetchType.EAGER)
    @JoinTable(name = "parents_children",
            joinColumns = [JoinColumn(name = "child_user_id")],
            inverseJoinColumns = [JoinColumn(name = "parent_user_id")]
    )
    var parents: Set<User> = HashSet<User>()

    //endregion


    @PrePersist
    fun onPersist() {
        updatedAt = Instant.now()
        createdAt = updatedAt
        this.generateAuthToken()
    }

    @PreUpdate
    fun onUpdate() {
        updatedAt = Instant.now()
    }

    // TODO: These should be set in setters of current tracking items
   fun setTracking() {
       this.lastSignInAt = this.currentSignInAt
       this.lastSignInIp = this.currentSignInIp
       this.lastUserAgent = this.currentUserAgent
   }

    fun updatePassword(value: String) {
        this.passwordDigest = BCryptPasswordService.encode(value)
        this.passwordSetAt = Instant.now()
    }

    fun generatePasswordResetToken() {
        this.passwordResetToken = Util.randomBase58(24)
        this.passwordResetSentAt = Instant.now()
    }

    fun generateAuthToken() {
        this.authToken = Util.randomBase58(24)
        this.authTokenSetAt = Instant.now()
    }

    fun isParent(): Boolean {
        return this.children.isNotEmpty()
    }

    fun isChild(): Boolean {
        return this.parents.isNotEmpty()
    }
}

