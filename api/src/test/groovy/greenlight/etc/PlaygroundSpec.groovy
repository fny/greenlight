package greenlight.etc

import greenlight.entities.UserPassword
import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

import java.util.logging.Logger
/**
 * This test is used as scratch space.
 */
@MicronautTest
class PlaygroundSpec extends Specification {

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
}
