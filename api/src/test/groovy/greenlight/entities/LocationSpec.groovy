package greenlight.entities

import greenlight.etc.Util
import greenlight.factories.LocationFactory
import io.micronaut.context.ApplicationContext
import io.micronaut.test.annotation.MicronautTest
import org.hibernate.SessionFactory
import spock.lang.AutoCleanup
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject

/**
 * This test is used as scratch space.
 */
@MicronautTest
class LocationSpec extends Specification {
    @Inject
    SessionFactory sf
    @AutoCleanup
    @Shared
    ApplicationContext ctx = ApplicationContext.run()

    def "formats permalink on save"() {
        expect:
        def location2 = new LocationFactory().build([name: 'Strong House', permalink: '💪-house'])
        Util.withinTransaction(sf) {
            sess -> sess.save(location2)
        }
        location2.permalink == '--house'
        def location1 = new LocationFactory().build([name: 'My House', permalink: null])
        Util.withinTransaction(sf) {
            sess -> sess.save(location1)
        }
        location1.permalink == 'my-house'
    }
}
