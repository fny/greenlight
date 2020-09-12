package greenlight.etc

import com.google.i18n.phonenumbers.PhoneNumberUtil
import javax.validation.Constraint
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext
import javax.validation.Payload
import kotlin.reflect.KClass


@MustBeDocumented
@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = [PhoneValidator::class])
annotation class Phone(
    // TODO: I18n
    val message: String = "invalid phone number",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class PhoneValidator : ConstraintValidator<Phone, String> {
    private val phoneNumberUtil = PhoneNumberUtil.getInstance()
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        // It's okay for the value to be null
        if (value == null) return true

        val phoneNumber = phoneNumberUtil.parse(value, "US")
        return phoneNumberUtil.isValidNumberForRegion(phoneNumber, "US")
    }
}


@MustBeDocumented
@Target(AnnotationTarget.FIELD)
@Constraint(validatedBy = [ZipCodeValidator::class])
annotation class ZipCode(
    // TODO: I18n
    val message: String = "invalid zip code",
    val groups: Array<KClass<*>> = [],
    val payload: Array<KClass<out Payload>> = []
)

class ZipCodeValidator : ConstraintValidator<ZipCode, String> {
    private val zipCodeRegex = "^[0-9]{5}(-[0-9]{4})?$".toRegex()
    override fun isValid(value: String?, context: ConstraintValidatorContext?): Boolean {
        // It's okay for the value to be null
        if (value == null) return true

        return value.matches(zipCodeRegex)
    }
}
