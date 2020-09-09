package greenlight.models.entities
import greenlight.entities.AbstractBase
import greenlight.etc.randomBase58

import io.micronaut.core.annotation.Introspected
import java.time.Instant
import java.util.*
import javax.annotation.Nullable
import javax.persistence.*
import javax.validation.constraints.Email
import javax.validation.constraints.Max
import javax.validation.constraints.Min
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull


@Introspected
@Entity
@Table(name = "users")
class User : AbstractBase() {

    //region info
    @NotBlank var firstName : String? = null
    @NotBlank var lastName : String? = null
    //endregion


    //region authentication
    var passwordDigest : String? = null
    var passwordSetAt : Instant? = null

    @Column(unique=true)
    var passwordResetToken : String? = null
    var passwordResetSentAt : Instant? = null

    @Column(unique=true)
    var authToken : String? = null
    var authTokenSetAt : Instant? = null
    //endregion

    //region email
    @Email var email : String? = null
    @Column(unique=true)
    var emailConfirmationToken : String? = null
    var emailConfirmationSentAt : Instant? = null
    var emailConfirmedAt : Instant? = null
    var emailUnconfirmed : String? = null
    //endregion

    //region mobile
    var mobileNumber : String? = null
    var mobileCarrier : String? = null
    var isSmsGatewayEmailable = false
    @Column(unique=true)
    var mobileNumberConfirmationToken : String? = null
    var mobileConfirmationSentAt : Instant? = null
    var mobileNumberConfirmedAt : Instant? = null
    var mobileNumberUnconfirmed : String? = null
    //endregion

    //region user details
    var zipCode : String? = null
    @Min(0) @Max(2) var gender : Int? = null
    var ethnicity : String? = null
    var birthDate : Instant? = null
    var physicianName : String? = null
    var physicianPhoneNumber : String? = null
    //endregion

    //region useful timestamps
    var acceptedTermsAt : Instant? = null
    var reviewedAt : Instant? = null
    //endregion

    //region common timstamps
    var deletedAt : Instant? = null
    @Column(updatable = false) var createdAt : Instant? = null
    var updatedAt : Instant? = null

    //endregion


    //region tracking
    var currentSignInAt : Instant? = null
    var lastSignInAt : Instant? = null
    var lastSeenAt : Instant? = null
    @Min(0) var signInCount : Int? = null
    var currentSignInIp // todo ip address validation regex?
                         : String? = null
    var currentUserAgent : String? = null
    var lastSignInIp : String? = null
    var lastUserAgent : String? = null
    //endregion


     @PrePersist fun onPersist() {
          updatedAt = Instant.now()
          createdAt = updatedAt
         this.generateAuthToken()
     }

     @PreUpdate fun onUpdate() {
          updatedAt = Instant.now()
     }

    fun softDelete(deletedBy: User) {

    }


    fun generatePasswordResetToken() {
        this.passwordResetToken = randomBase58(24)
        this.passwordResetSentAt = Instant.now()
    }


    fun generateAuthToken() {
        this.authToken = randomBase58(24)
        this.authTokenSetAt = Instant.now()
    }
}
