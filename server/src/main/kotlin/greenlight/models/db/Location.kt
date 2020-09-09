package greenlight.models.db

import greenlight.etc.validators.ValidPhone
import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.UpdateTimestamp
import java.time.Instant
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType.AUTO
import javax.persistence.Id
import javax.persistence.ManyToOne
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

class Location {

     @Id @GeneratedValue(strategy = AUTO) var id : Int? = null
     var name : @NotBlank String? = null

     // todo index
     var permalink : @NotBlank String? = null
     var registrationCode : @NotBlank String? = null
     var website : String? = null

     @ValidPhone var phoneNumber : String? = null
     var email : @NotBlank @Email String? = null

     //todo validate
     var zipCode : String? = null
     var hidden : @NotNull Boolean? = false
     var category : String? = null

     @CreationTimestamp var createdAt : Instant? = null

     @UpdateTimestamp var updatedAt : Instant? = null
     var deletedAt : Instant? = null

     @ManyToOne var createdBy = Defaults.User

     @ManyToOne var updatedBy = Defaults.User

     @ManyToOne var deletedBy = Defaults.User
}