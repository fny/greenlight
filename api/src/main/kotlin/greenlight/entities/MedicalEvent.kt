package greenlight.entities

import io.micronaut.core.annotation.Introspected
import java.time.Instant
import javax.persistence.Entity
import javax.persistence.PrePersist
import javax.persistence.Table
import javax.validation.constraints.NotBlank
@Introspected
@Entity
@Table(name = "medical_events")
class MedicalEvent : AbstractBase() {
    enum class Events(val event: String) {
      NONE("none"),
      FEVER("fever"),
      NEW_COUGH("new_cough"),
      DIFFICULTY_BREATING("difficulty_breathing"),
      TASTE_SMELL("taste_smell"),
      CHILLS("chills"),
      COVID_EXPOSURE("covid_exposure"),
      COVID_TEST("covid_test"),
      COVID_TEST_POSITIVE("covid_test_positive"),
      COVID_TEST_NEGATIVE("covid_test_negative"),
      COVID_DIAGNOSIS("covid_diagnosis"),
      COVID_RULED_OUT("covid_ruled_out"),
      SYMPTOM_IMPROVEMENT("symptom_improvement")
    }

    @NotBlank
    var eventType : String? = null
    @NotBlank
    var occurredAt : Instant? = null
    @NotBlank
    var createdAt : Instant? = null

    @PrePersist
    fun onPersist() {
        createdAt = Instant.now()
    }
}
