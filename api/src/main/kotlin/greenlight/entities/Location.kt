package greenlight.entities

import greenlight.etc.Phone
import javax.persistence.Column
import javax.validation.constraints.Email
import javax.validation.constraints.NotBlank

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
