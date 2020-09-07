package greenlight.controllers

import greenlight.models.public.CreateUserFormData
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.*
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import org.slf4j.LoggerFactory
import java.net.URI
import java.security.Principal
import javax.validation.Valid

@Controller("/user")
@Secured(SecurityRule.IS_ANONYMOUS)
open class UserController {

    /**
     * Returns the current user associated with the auth token
     */
    @Get("/")
    fun getCurrentUser(principal: Principal?): String {
        return "Current User"
    }

    @Get("/:{id}")
    fun getUser(@PathVariable
                id: String): String {
        return "User $id"
    }


    @Post
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    open fun createUser(@Body formData: CreateUserFormData): HttpResponse<Any> {
        LoggerFactory.getLogger("UserController")
                .info("Received a form submittion with body $formData")

        return HttpResponse.redirect(URI("/admin/users"))
    }
}
