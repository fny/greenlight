package greenlight.providers.db

import greenlight.models.db.User
import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.CrudRepository
import io.micronaut.validation.Validated
import java.util.*
import javax.inject.Inject
import javax.inject.Singleton
import javax.validation.Valid


@Repository
interface UserRepository : CrudRepository<User, UUID>

@Singleton
@Validated
class UserService {

     @Inject lateinit var userRepo : UserRepository

     fun save(@Valid user : User) {
          println("Saving user $user")
          val savedEntity = userRepo.save(user)
          println("User saved. $savedEntity")
     }
}
