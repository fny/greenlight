package greenlight.controllers

import com.google.common.collect.ImmutableList
import com.google.common.collect.ImmutableMap
import greenlight.models.entities.User
import io.micronaut.http.HttpResponse
import io.micronaut.http.MediaType
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.security.annotation.Secured
import io.micronaut.security.rules.SecurityRule
import io.micronaut.views.View

@Controller("/admin")
@Secured(SecurityRule.IS_ANONYMOUS) // todo @Secured("isAdmin()")
class AdminController {

    @Get(value = "/", produces = [MediaType.TEXT_HTML])
    @View("admin.dashboard")
    fun index(): HttpResponse<Any> {
        return HttpResponse.ok(ImmutableMap.of("username", "test", "loggedIn", true))
    }

    @Get(value = "/users", produces = [MediaType.TEXT_HTML])
    @View("admin.users")
    fun users() : HttpResponse<Any> {
        return HttpResponse.ok(ImmutableMap.of("users", ImmutableList.of<User>(), "total", 0, "page", 1))
    }
}