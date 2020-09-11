package greenlight.repositories

import greenlight.entities.User
import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.reactive.RxJavaCrudRepository
import java.util.UUID

@Repository
interface UserRespository : RxJavaCrudRepository<User, UUID> {
  fun find(id: UUID): User
  fun findByAuthToken(authToken: String): User
}
