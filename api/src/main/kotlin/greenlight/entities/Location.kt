package greenlight.entities

import greenlight.etc.Phone
import io.micronaut.core.annotation.Introspected
import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Table
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank
@Introspected
@Entity
@Table(name = "locations")
class Location : AbstractBase() {
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


}
