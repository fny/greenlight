package greenlight.services.components.sms

import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SmsService {
  @Inject lateinit var smsSender : SmsSender
}
