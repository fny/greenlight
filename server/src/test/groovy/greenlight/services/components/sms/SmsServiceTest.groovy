package greenlight.services.components.sms


import io.micronaut.test.annotation.MicronautTest
import spock.lang.Ignore
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest(environments = ["dev"])
class SmsServiceTest extends Specification {

  @Inject @Shared SmsSender smsSender

  void 'sms factory injects twilio instance properly'() {
    expect:
      TwilioSmsSender.isInstance(smsSender)
  }

  @Ignore // activating this test will be costly
  void 'Twilio can send message'() {
    when:
      def sid = smsSender.send("This is a test, which costs money! Bye now 🤪",
          "+12265000405")
          .blockingGet()
    then:
      !sid.isEmpty()
  }
}
