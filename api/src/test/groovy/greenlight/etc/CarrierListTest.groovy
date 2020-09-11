package greenlight.etc

import io.micronaut.test.annotation.MicronautTest
import spock.lang.Specification

@MicronautTest
class CarrierListTest extends Specification {
    def "find looks up a carrier by id"() {
        when:
        def carrier = MobileCarrierList.INSTANCE.find("sprint")
        then:
        carrier.name == "Sprint"
        carrier.sms_domain == "messaging.sprintpcs.com"
        carrier.mms_domain == "pm.sprint.com"
    }
}
