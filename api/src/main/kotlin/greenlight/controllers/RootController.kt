package greenlight.controllers

import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.annotation.Status
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.netty.handler.codec.http.HttpObject

@Controller("/api/v1")
class RootController {
    // @Get
    // @Status(HttpStatus.OK)
    // fun root(): {
    //     return
    // }

    @Secured(SecurityRule.IS_ANONYMOUS)
    @Get("/ping")
    @Status(HttpStatus.OK)
    fun ping(): String {
      return "pong"
    }

}
