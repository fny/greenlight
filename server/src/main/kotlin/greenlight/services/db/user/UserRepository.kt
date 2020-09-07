package greenlight.services.db.user

import greenlight.models.entities.User
import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.CrudRepository
import java.util.*


@Repository
interface UserRepository : CrudRepository<User, UUID>
