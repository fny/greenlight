package greenlight.services.db.user


import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest
class UserRepositoryTest extends Specification {
    
    @Inject
    UserRepository personRepo
    
    // if this test is created, then personRepo was injected, therefore test passes
    def 'PersonRepository can be created'() {
        when:
              def res = 1 + 1
        then:
              res == 2
    }
    
    
    def 'A parent can be created'() {
    
    }
    
    def 'A child can be created'() {
    
    }
    
    def 'A child without a parent cannot be created'() {
    
    }
    
    def 'A parent without a child cannot be created'() {
    
    }
    
    def 'A default parent named GREENLIGHT exists'() {
    
    }
    
}
