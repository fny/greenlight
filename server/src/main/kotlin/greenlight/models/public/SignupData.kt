package greenlight.models.public

import io.micronaut.core.annotation.Introspected

@Introspected
open class SignupData {
  open var name : String? = null
  open var email : String? = null
  open var zipCode : String? = null
}
