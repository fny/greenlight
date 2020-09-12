package greenlight.entities

import javax.persistence.Column
import javax.validation.constraints.NotBlank

class Locations : AbstractBase() {
    @NotBlank
    var name : String? = null
    @NotBlank
    @Column(unique = true)
    var permalink : String? = null
    @NotBlank
    var category: String? = null
    var phoneNumber : String? = null
    var emailAddress : String? = null
    var zipCode : String? = null
    var hidden : Boolean? = null
}
