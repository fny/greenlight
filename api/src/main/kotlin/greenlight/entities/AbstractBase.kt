package greenlight.entities

import java.util.UUID
import javax.persistence.Column
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.MappedSuperclass
import javax.validation.ConstraintViolation
import javax.validation.Validation

@MappedSuperclass
abstract class AbstractBase {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false)
    open var id: UUID = UUID.randomUUID()

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || javaClass != other.javaClass) return false
        val that = other as AbstractBase
        if (id != that.id) return false
        return true
    }

    override fun hashCode(): Int {
        return id.hashCode()
    }
}
