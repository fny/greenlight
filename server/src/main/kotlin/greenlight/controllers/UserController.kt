package greenlight.controllers

import io.micronaut.http.HttpStatus
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.PathVariable
import io.micronaut.http.annotation.Post
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import java.security.Principal

@Controller("/user")
@Secured(SecurityRule.IS_AUTHENTICATED)
class UserController {
  
  /**
   * Returns the current user associated with the auth token
   */
  @Get("/") fun getCurrentUser(principal : Principal?) : String {
    return "Current User"
  }
  
  @Get("/:{id}") fun getUser(@PathVariable id : String) : String {
    return "User $id"
  }
  
  @Post(value = "/", consumes = [MediaType.APPLICATION_FORM_URLENCODED],
        produces = [MediaType.TEXT_PLAIN]) fun createUser(name : String?,
                                                          email : String?,
                                                          zipCode : String?) : HttpStatus {
    return HttpStatus.ACCEPTED
  }
}
