package greenlight.etc.validators

import javax.validation.Constraint
import kotlin.annotation.AnnotationTarget.FIELD
import kotlin.annotation.AnnotationTarget.LOCAL_VARIABLE
import kotlin.annotation.AnnotationTarget.VALUE_PARAMETER

@Retention(AnnotationRetention.RUNTIME)
@Constraint(validatedBy = [PhoneValidator::class])
@MustBeDocumented
@Target(FIELD, VALUE_PARAMETER, LOCAL_VARIABLE)
annotation class ValidPhone(val message : String = "Invalid phone number")