package greenlight.services.components.sms

import com.twilio.Twilio
import com.twilio.rest.api.v2010.account.Message
import com.twilio.type.PhoneNumber
import io.micronaut.context.annotation.*
import io.reactivex.Single

interface SmsSender {
  /**
   * Sends [message] [to] phone number, returning an "sid" or unique code to identify
   * this message for future reference.
   */
  fun send(message : String, to : String) : Single<String>
}


/**
 * Read from application-{env}.yml file
 */
@Context
@ConfigurationProperties("twilio")
interface TwilioConfig {
  val sid : String
  val auth : String
  val phones : Array<String>
}

/**
 * This costs money! We should only use/test in dev sparingly and keep it for
 * production only
 */
class TwilioSmsSender(val sid : String, val auth : String, val senderNumber :
String) : SmsSender {
  
  val from = PhoneNumber(senderNumber)
  
  init {
    Twilio.init(sid, auth)
  }
  
  override fun send(message : String, to : String) : Single<String> {
    return Single.fromCallable {
      Message.creator(PhoneNumber(to), from, message)
          .create()
          .sid
    }
  }
}
