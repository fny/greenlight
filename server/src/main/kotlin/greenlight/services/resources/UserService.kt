package greenlight.services.resources

import greenlight.entities.Person
import greenlight.models.public.SignupData
import greenlight.services.db.person.PersonRepository
import io.micronaut.validation.Validated
import io.reactivex.Observable
import io.reactivex.Single
import javax.inject.Inject
import javax.inject.Singleton
import javax.validation.constraints.NotBlank
import javax.validation.constraints.NotNull

@Singleton
@Validated
class UserService {
  
  @Inject lateinit var repo : PersonRepository
  
  /**
   * returns the auth token on successful creation
   */
  fun createUser(name: String, email: String, zipCode: String) : Single<String> {
    val p = Person(name, email, zipCode, "123454321")
    return Single.fromCallable {
      repo.save(p)
      p.auth
    }
  }
  
  fun authenticate(email : String, token : String) : Single<Boolean> {
    return Single.fromCallable {
        val person = repo.findById(email).get()
        person.auth == token
      }
  }
  
  fun all() : MutableIterable<Person> {
    return repo.findAll()
  }
}
