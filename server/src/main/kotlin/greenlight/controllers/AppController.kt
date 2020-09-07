package greenlight.controllers

import io.micronaut.http.MediaType
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule

@Controller("/")
@Secured(SecurityRule.IS_ANONYMOUS)
class AppController {

    @Get
    @Produces(MediaType.TEXT_PLAIN)
    fun index(): String {
        return "Welcome to Greenlight APIs"
    }
}
