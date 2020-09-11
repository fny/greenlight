package greenlight.controllers

import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Post
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule

@Controller("/api/v1/auth")
class AuthController {

    @Secured(SecurityRule.IS_ANONYMOUS)
    @Post("/sign-in")
    fun signIn(): String {
      return "pong"
    }
}
