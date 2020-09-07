package greenlight.etc.validators;


import io.micronaut.aop.Around;

import javax.validation.Constraint;
import java.lang.annotation.*;


@Retention(RetentionPolicy.RUNTIME) @Constraint(validatedBy = {PhoneValidator.class}) @Documented @Target(value = {ElementType.FIELD,
        ElementType.PARAMETER, ElementType.LOCAL_VARIABLE}) public @interface ValidPhone {
  String message() default "Invalid phone number";
}
