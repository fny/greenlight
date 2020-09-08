package greenlight.models.public

import io.micronaut.core.annotation.Introspected
import io.micronaut.validation.Validated
import javax.validation.constraints.*

/*
* name=Nima G, phone=+12265000405,
*  email=nimagtabrizi@gmail.com,
*  birthday=1991/04/02,
*  gender=1,
*  ethnicity=1
* zipcode=m2m2h6, physician=asdasd, physicianPhone=+12265000405, submit=}
* */
@Introspected
@Validated
open class CreateUserFormData {

    @Pattern(regexp = "/[a-zA-Z]+ [a-zA-Z]/")
    val name: String? = null

    @NotBlank
    val email: String? = null

    @Size(min = 5, max = 10)
    val zipcode: String? = null


    //        @Pattern(regexp = "[1-2][0-9]{3}+[/][1-9]|1[012][/][0-9]{1,2}+")
    val birthday: String? = null

    // todo improve phone regex or offload validation to service
    //        @Pattern(regexp = "[+][1][0-9]{10}+")
    val phone: String? = null

    //        @Min(value = 0)
    //        @Max(value = 2)
    val gender: Int = 0

    //        @Min(value = 0)
    //        @Max(value = 9)
    val ethnicity: Int = 0

    val physician: String? = null
    val physicianPhone: String? = null
}
