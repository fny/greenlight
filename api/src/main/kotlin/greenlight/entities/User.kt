package greenlight.entities

import com.google.i18n.phonenumbers.PhoneNumberUtil
import greenlight.etc.BCryptPasswordService
import greenlight.etc.Util
import io.micronaut.core.annotation.Introspected
import java.time.Instant
import java.util.Date

import javax.validation.constraints.Email
import javax.validation.constraints.Max
import javax.validation.constraints.Min
import javax.validation.constraints.NotBlank

import greenlight.etc.Phone
import greenlight.etc.ZipCode
import javax.persistence.*

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
    @Phone
    var mobileNumber : String? = null
        set(value) {
            val pnu = PhoneNumberUtil.getInstance()
            val parsed = pnu.parse(value, "US")
            field = pnu.format(parsed, PhoneNumberUtil.PhoneNumberFormat.E164)
        }
    var mobileCarrier : String? = null
    var isSmsGatewayEmailable = false
    var mobileNumberConfirmationToken : String? = null
    var mobileNumberConfirmationSentAt : Instant? = null
    var mobileNumberConfirmedAt : Instant? = null
    @Phone
    var mobileNumberUnconfirmed : String? = null
    //endregion

    //region user details
    @ZipCode
    var zipCode : String? = null
    @Min(0) @Max(2) var gender : Int? = null
    var ethnicity : String? = null
    var birthDate : Date? = null
    var physicianName : String? = null
    @Phone
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
    @ManyToMany(targetEntity = User::class, fetch = FetchType.LAZY)
    @JoinTable(name = "parents_children",
            joinColumns = [JoinColumn(name = "parent_user_id")],
            inverseJoinColumns = [JoinColumn(name = "child_user_id")]
    )
    var children: Set<User> = HashSet()

    @ManyToMany(targetEntity = User::class, fetch = FetchType.LAZY)
    @JoinTable(name = "parents_children",
            joinColumns = [JoinColumn(name = "child_user_id")],
            inverseJoinColumns = [JoinColumn(name = "parent_user_id")]
    )
    var parents: Set<User> = HashSet()

    @ManyToMany(targetEntity = Location::class, fetch = FetchType.LAZY)
    @JoinTable(name = "location_accounts",
            joinColumns = [JoinColumn(name = "user_id")],
            inverseJoinColumns = [JoinColumn(name = "location_id")]
    )
    var locations: Set<Location> = HashSet()

    @OneToMany(targetEntity = LocationAccount::class, fetch = FetchType.LAZY)
    var locationAccounts: Set<LocationAccount> = HashSet()

    @OneToMany(targetEntity = MedicalEvent::class, fetch = FetchType.LAZY)
    var medicalEvents: Set<MedicalEvent> = HashSet()

    @OneToMany(targetEntity = GreenlightStatus::class, fetch = FetchType.LAZY)
    var greenlightStatuses: Set<GreenlightStatus> = HashSet()

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

