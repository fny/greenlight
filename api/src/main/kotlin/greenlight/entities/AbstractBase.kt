package greenlight.entities

import java.util.*
import javax.persistence.Column
import javax.persistence.GeneratedValue
import javax.persistence.Id

open abstract class AbstractBase {
    @Id
    @GeneratedValue
    @Column( columnDefinition = "uuid", updatable = false )
    open var id: UUID = UUID.randomUUID()

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || javaClass != other.javaClass) return false
        val that = other as AbstractBase
        if (id != other.id) return false
        return true
    }

    override fun hashCode(): Int {
        return if (id != null) {
            id.hashCode()
        } else {
            0
        }
    }
}
