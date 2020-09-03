package greenlight.services.resources

import greenlight.services.db.user.PersonRepository
import io.micronaut.validation.Validated
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@Validated
class UserService {

  @Inject lateinit var personRepo : PersonRepository

}
