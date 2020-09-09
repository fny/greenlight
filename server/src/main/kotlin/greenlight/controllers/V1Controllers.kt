package greenlight.controllers

import com.fasterxml.jackson.databind.util.JSONPObject
import com.google.common.collect.ImmutableList
import com.google.common.collect.ImmutableMap
import greenlight.models.db.User
import greenlight.providers.db.UserService
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Consumes
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Patch
import io.micronaut.http.annotation.PathVariable
import io.micronaut.http.annotation.Produces
import io.micronaut.http.annotation.Put
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import java.security.Principal
import javax.inject.Inject

@Controller("/")
@Secured(SecurityRule.IS_ANONYMOUS)
open class AppController {

     @Get @Produces(MediaType.TEXT_PLAIN) fun index() : String {
          return "Welcome to Greenlight APIs"
     }
}

@Controller("/api/v1/users")
@Secured(SecurityRule.IS_ANONYMOUS)
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
open class UserController {

     @Inject lateinit var userService : UserService

     /**
      * Returns the current user associated with the auth token
      */
     @Get fun getCurrentUser(principal : Principal?) : String {
          return getUser("/:current")
     }

     @Get("/:{id}") fun getUser(@PathVariable id : String) : String {
          return "User $id"
     }

     @Put fun createUser(@Body body : JSONPObject) : String {
          return "NOT OK"
     }

     @Patch("/:{id}") fun updateUser(@PathVariable id : String) : String {
         return ""
     }
}

@Controller("/admin")
class AdminController {

     @Get(value = "/", produces = [MediaType.TEXT_HTML]) fun index() : HttpResponse<Any> {
          return HttpResponse.ok(ImmutableMap.of("username", "test", "loggedIn", true))
     }

     @Get(value = "/users", produces = [MediaType.TEXT_HTML]) fun users() : HttpResponse<Any> {
          return HttpResponse.ok(ImmutableMap.of("users", ImmutableList.of<User>(), "total", 0, "page", 1))
     }
}