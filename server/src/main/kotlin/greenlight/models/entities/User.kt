package greenlight.models.entities

import greenlight.etc.validators.ValidPhone
import io.micronaut.core.annotation.Introspected
import java.time.Instant
import java.util.*
import javax.annotation.Nullable
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.persistence.OneToMany
import javax.persistence.PrePersist
import javax.persistence.PreUpdate
import javax.persistence.Table
import javax.persistence.Transient
import javax.validation.constraints.Email
import javax.validation.constraints.Max
import javax.validation.constraints.Min
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull


@Introspected
@Entity
@Table(name = "USERS")
class User {

     constructor()

     constructor(id : UUID,
                 firstName : @NotBlank String?,
                 lastName : @NotBlank String?,
                 email : @Email String?,
                 mobileNumber : @NotNull String?) : super() {
          this.id = id
          this.firstName = firstName
          this.lastName = lastName
          this.email = email
          this.mobileNumber = mobileNumber
     }

     //region basic
     @Id @NotNull var id : UUID = UUID.randomUUID()

     @NotBlank var firstName : String? = null
     @NotBlank var lastName : String? = null

     //endregion
     //region password
     var passwordDigest : String? = null
     var passwordSetAt : Instant? = null
     var rememberMeSetAt : Instant? = null

     // todo index, unique
     var passwordResetToken : String? = null
     var passwordResetSentAt : Instant? = null

     // todo index, unique
     var authToken : String? = null
     var authTokenSetAt : Instant? = null
     var magicSignInToken : String? = null

     //endregion
     //region email
     @Email var email : String? = null

     // todo index
     var emailConfirmationToken : String? = null
     var emailConfirmationSentAt : Instant? = null
     var emailConfirmedAt : Instant? = null
     var emailUnconfirmed : String? = null

     //endregion
     //region mobile
     @ValidPhone var mobileNumber : String? = null
     var mobileCarrier : String? = null
     var isSmsGatewayEmailable = false
     var mobileConfirmationSentAt : Instant? = null
     var mobileNumberConfirmedAt : Instant? = null

     @ValidPhone var mobileNumberUnconfirmed : String? = null

     //endregion

     //region user details
     var zipCode : String? = null
     @Min(0) @Max(2) var gender : Int? = null
     var ethnicity : String? = null
     var birthDate : Instant? = null
     var physicianName : String? = null
     @ValidPhone var physicianPhoneNumber : String? = null
     //endregion

     //region timestamps
     var acceptedTermsAt : Instant? = null
     var reviewedAt : Instant? = null
     var deletedAt : Instant? = null

     @Column(updatable = false) var createdAt : Instant? = null
     var updatedAt : Instant? = null
     var currentSignInAt : Instant? = null
     var lastSignInAt : Instant? = null
     var lastSeenAt : Instant? = null

     //endregion
     //region tracking
     @Min(0) var signInCount : Int? = null
     var currentSignInIp // todo ip address validation regex?
                             : String? = null
     var currentUserAgent : String? = null
     var lastSignInIp : String? = null
     var lastUserAgent : String? = null

     //endregion

     //region associations
     @ManyToOne var createdBy : User = Defaults.User
     @ManyToOne var deletedBy : User = Defaults.User
     @ManyToOne var updatedBy : User = Defaults.User
     @ManyToOne var reviewedBy : User = Defaults.User
     @Nullable @OneToMany var statuses : MutableSet<GreenlightStatus> = mutableSetOf()

     // todo
     //@Nullable @OneToMany var children : Set<User>? = null
     //@Nullable @OneToMany var parents : Set<User>? = null
     //@Nullable @OneToMany @JoinTable(name = "USERS_LOCATIONS", joinColumns = @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
     // , inverseJoinColumns = @JoinColumn(name = "LOCATION_ID", referencedColumnName = "ID")) public Set<Location> locations;
     //endregion

     @PrePersist fun onPersist() {
          updatedAt = Instant.now()
          createdAt = updatedAt
     }

     @PreUpdate fun onUpdate() {
          updatedAt = Instant.now()
     }
}


