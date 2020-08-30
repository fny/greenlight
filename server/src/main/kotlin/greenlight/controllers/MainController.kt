package greenlight.controllers

import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Produces

@Controller("/")
class MainController {

    @Get("/")
    @Produces(MediaType.TEXT_PLAIN)
    fun index(): String {
        return "Welcome to Greenlight APIs"
    }
    
    @Post("/")
    fun postIndex() : String {
        return "You posted something"
    }
}
