package greenlight.controllers

import io.micronaut.http.MediaType
import io.micronaut.http.annotation.*

@Controller("/")
class AppController {
  
  @Get("/") @Produces(MediaType.TEXT_PLAIN) fun index() : String {
    return "Welcome to Greenlight APIs"
  }
}
