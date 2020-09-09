package greenlight.etc.validators

import com.google.i18n.phonenumbers.PhoneNumberUtil
import io.micronaut.core.annotation.AnnotationValue
import io.micronaut.validation.validator.constraints.ConstraintValidator
import io.micronaut.validation.validator.constraints.ConstraintValidatorContext
import javax.inject.Singleton
import javax.validation.Constraint
import kotlin.annotation.AnnotationTarget.FIELD
import kotlin.annotation.AnnotationTarget.LOCAL_VARIABLE
import kotlin.annotation.AnnotationTarget.VALUE_PARAMETER

@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [PhoneValidator::class])
@MustBeDocumented
@Target(FIELD, VALUE_PARAMETER, LOCAL_VARIABLE)
annotation class ValidPhone(val message : String = "Invalid phone number")

@Singleton
class PhoneValidator : ConstraintValidator<ValidPhone, String> {

     override fun isValid(value : String?,
                          annotationMetadata : AnnotationValue<ValidPhone>,
                          context : ConstraintValidatorContext) : Boolean {
          return isValid(value)
     }

     override fun isValid(value : String?,
                          context : javax.validation.ConstraintValidatorContext) : Boolean {
          return isValid(value)
     }

     private fun isValid(value : String?) : Boolean {
          val pnu = PhoneNumberUtil.getInstance()
          return try {
               val phoneNumber = pnu.parse(value, "US")
               pnu.isValidNumber(phoneNumber)
          } catch (e : Exception) {
               false
          }
     }
}
