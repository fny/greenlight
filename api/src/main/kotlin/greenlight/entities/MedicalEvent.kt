package greenlight.entities

import java.time.Instant
import javax.validation.constraints.NotBlank

class MedicalEvent : AbstractBase() {
    @NotBlank
    var eventType : String? = null
    @NotBlank
    var occurredAt : Instant? = null
    @NotBlank
    var createdAt : Instant? = null
}
