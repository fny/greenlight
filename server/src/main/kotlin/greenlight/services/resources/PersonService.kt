package greenlight.services.resources

import greenlight.services.db.user.UserRepository
import io.micronaut.validation.Validated
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
@Validated
class PersonService {

  @Inject lateinit var userRepo : UserRepository
}
