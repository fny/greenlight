package greenlight.services.db.person

import greenlight.entities.Person
import io.micronaut.data.annotation.Repository
import io.micronaut.data.repository.CrudRepository
import io.reactivex.Completable
import io.reactivex.Single
import java.util.*


@Repository
interface PersonRepository : CrudRepository<Person, String> {
}
