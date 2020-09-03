package greenlight.controllers

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule

@Controller("/admin")
// todo @Secured("isAdmin()")
class AdminController {

    @Get fun index() : String = "Yes you can access me"

    @Get("/users")
    fun users(): String {
        return "Get Users"
    }
}