package greenlight.controllers.api

import io.micronaut.http.HttpStatus
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Consumes
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import org.json.JSONObject
import javax.validation.Valid
import javax.validation.constraints.NotBlank


@Controller("/api/v1/users")
@Secured(SecurityRule.IS_ANONYMOUS)
open class UsersController {


    @Post
    @Consumes(MediaType.APPLICATION_JSON)
    open fun createUser(@Body @Valid  jsonBody: JsonUser): String {
        return "id goes here"
    }
}

open class JsonUser {
    @NotBlank
    var name: String? = null
}