package greenlight.entities

import com.sun.istack.NotNull
import io.micronaut.context.annotation.Bean
import javax.validation.constraints.NotBlank
import javax.validation.constraints.Size

class UserPassword {
    @NotBlank
    @Size(min = 8, max = 70)
    lateinit var password: String
}
