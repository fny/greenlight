package greenlight

import io.micronaut.runtime.EmbeddedApplication
import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification
import spock.lang.Unroll

import javax.inject.Inject

@MicronautTest(environments = ["test", "dev"])
class CoreSpec extends Specification {

    @Inject
    EmbeddedApplication application

    void 'test it works'() {
        expect:
        application.running
    }

    @Unroll
    void 'should fail'() {
        when:
            def res = 2 + 2

        then:
            res == 4
    }
}
