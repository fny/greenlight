package greenlight.services.db.user

import greenlight.models.entities.Person
import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.CrudRepository


@Repository
interface PersonRepository : CrudRepository<Person, Long> {
}
