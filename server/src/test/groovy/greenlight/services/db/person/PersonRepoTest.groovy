package greenlight.services.db.person

import greenlight.entities.Person
import io.micronaut.test.annotation.MicronautTest
import org.assertj.core.api.Assertions
import spock.lang.Ignore
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject


@MicronautTest
class PersonRepoTest extends Specification {

  @Shared @Inject PersonRepository personRepo

  @Ignore
  def "saving new person to db is fine"(String name, String zipCode) {
    when:
      def action = personRepo.save(new Person(name, zipCode))
    then:
      action.blockingGet() == null // no exception means success!
    where:
      name    | zipCode
      "Nima"  | "ASDASD"
      "Faraz" | "XYZXYZ"
  }

  def "FindById"() {
  }

  def "DeleteById"() {
  }
}
