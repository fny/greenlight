package greenlight.etc

import greenlight.Example
import greenlight.entities.UserPassword
import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

import javax.inject.Inject
import java.util.logging.Logger
/**
 * This test is used as scratch space.
 */
@MicronautTest
class PlaygroundSpec extends Specification {
    @Inject
    private Example example
    Logger logger = Logger.getLogger("")

    def "working on password"() {
        expect:
        def p = new UserPassword()
        p.setPassword("short")
        def violations = Util.validate(p)
        violations.each {
            logger.warning(it.message)
        }
        p
    }

    def "asdf"() {
        expect:
        example.name == "asdfs"
    }
}
