package greenlight

import greenlight.entities.User
import greenlight.repositories.UserRespository
import io.micronaut.http.annotation.Controller
import io.micronaut.http.annotation.Get
import io.micronaut.http.HttpStatus
import io.micronaut.http.annotation.Body
import io.micronaut.http.annotation.Post
import io.micronaut.http.annotation.Status
import io.reactivex.Maybe
import io.reactivex.Single
import java.util.UUID

@Controller("/api/v1/users")
class UsersController {
    lateinit var users: UserRespository

    @Get
    @Status(HttpStatus.OK)
    fun all(id: UUID): Single<List<User>> {
        return users.findAll().toList()
    }

    @Get("/{id}")
    @Status(HttpStatus.OK)
    fun show(id: UUID): Maybe<User> {
        return users.findById(id)
    }

    // @Get("/me")
    // @Status(HttpStatus.OK)
    // fun me(@Header("Authorization") authorization: String): Maybe<User>
    //
    // {
    //     return users.findByAuthToken(id)
    // }

    @Post
    @Status(HttpStatus.CREATED)
    fun update(id: UUID, @Body u: User): Single<User> {
      return users.save(u)
  }
}
