package greenlight.models.public

import javax.validation.constraints.NotBlank

open class User(
    @NotBlank var name : Name,
    @NotBlank var phone : String)

class Name(
    var firstName : String,
    var middleName : String?,
    var lastName : String)
