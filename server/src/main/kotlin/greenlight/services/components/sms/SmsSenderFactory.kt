package greenlight.services.components.sms

import io.micronaut.context.annotation.Bean
import io.micronaut.context.annotation.Factory
import javax.inject.Singleton

@Factory
internal class SmsSenderFactory {
  
  @Singleton @Bean fun provideTwilio(config : TwilioConfig) : SmsSender {
    // todo configure multiple phone numbers if necessary
    return TwilioSmsSender(config.sid, config.auth, config.phones[0])
  }
}
