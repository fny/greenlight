package greenlight

import greenlight.entities.User
import greenlight.repositories.UserRespository
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Status
import io.reactivex.Maybe
import io.reactivex.Single
import java.util.Optional
import java.util.UUID

@Controller("/api/v1/users")
class UsersController {
    lateinit var users: UserRespository

    @Get
    @Status(HttpStatus.OK)
    fun all(): Iterable<User> {
        return users.findAll()
    }

    @Get("/{id}")
    @Status(HttpStatus.OK)
    fun show(id: UUID): Optional<User> {
        return users.findById(id)
    }
}
