package greenlight.controllers

import greenlight.entities.Person
import greenlight.services.resources.UserService
import io.micronaut.http.HttpResponse
import io.micronaut.http.HttpStatus
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.*
import io.micronaut.validation.Validated
import io.reactivex.Single
import java.util.*
import javax.inject.Inject
import kotlin.NoSuchElementException

@Controller("/user")
class UserController {
  
  @Inject lateinit var userService : UserService
  
  @Get("/") fun index() : Single<List<Person>> {
    return Single.fromCallable {
      userService.all().toList()
    }
  }
  
  @Get("/auth{?email,token}") fun auth(email : String?, token : String?)
      : Single<HttpStatus> {
    return userService.authenticate("test@gmail.com", "123454321").map {
      if (it) {
        return@map HttpStatus.OK
      } else {
        return@map HttpStatus.UNAUTHORIZED
      }
    }.onErrorReturn { t ->
      if (t is NoSuchElementException)
        HttpStatus.NOT_FOUND
      else
        HttpStatus.INTERNAL_SERVER_ERROR
    }
  }
  
  @Post(value = "/", consumes = [MediaType.APPLICATION_FORM_URLENCODED],
        produces = [MediaType.TEXT_PLAIN])
  fun createUser(name : String?, email : String?, zipCode : String?) :
      Single<HttpStatus> {
    return userService.createUser(name!!, email!!, zipCode!!).map {
      HttpStatus.OK
    }
  }
}
