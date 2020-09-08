package greenlight.etc.validators;


import com.google.i18n.phonenumbers.PhoneNumberUtil
import io.micronaut.core.annotation.AnnotationValue
import io.micronaut.validation.validator.constraints.ConstraintValidator
import io.micronaut.validation.validator.constraints.ConstraintValidatorContext
import javax.inject.Singleton


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
               val phoneNumber = pnu.parse(value, "1")
               pnu.isValidNumber(phoneNumber)
          } catch (e : Exception) {
               false
          }
     }
}
