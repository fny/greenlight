package greenlight.repositories

import greenlight.entities.User
import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.CrudRepository
import io.micronaut.data.repository.reactive.RxJavaCrudRepository
import java.util.UUID

@Repository
interface UserRespository : CrudRepository<User, UUID> {
  fun find(id: UUID): User
  fun findByAuthToken(authToken: String): User
}


user = repo.finByAuthToken('asdf')
user.children.where( age < 10)
