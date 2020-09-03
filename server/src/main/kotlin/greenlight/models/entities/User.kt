package greenlight.models.entities

import org.hibernate.annotations.CreationTimestamp
import org.hibernate.annotations.Immutable
import org.hibernate.annotations.NaturalId
import org.hibernate.annotations.UpdateTimestamp
import java.sql.Date
import java.sql.Timestamp
import java.time.Instant
import java.util.*
import javax.persistence.*

@Entity
data class Person(
        @Id
        @GeneratedValue
        var id: UUID?,

        @Embedded
        var name: Name,

        @OneToMany(mappedBy = "owner", cascade = [CascadeType.ALL], orphanRemoval = true)
        var emails: List<Email>,

        @NaturalId(mutable = true)
        @OneToOne(optional = false, orphanRemoval = true, cascade = [CascadeType.ALL])
        var phone: Phone,

        @OneToOne(orphanRemoval = false)
        var zipCode: ZipCode,

        // todo convert ot enum
        var gender: Int,

        var ethnicity: String?,

        var birthDate: Date?,

        var physicianName: String?,

        var physicianPhoneNumber: String?,

        var reviewedAt: Timestamp?,

        var lastSeenAt: Timestamp?,

        var signInCount: Int?,

        var currentSignInAt: Timestamp?,

        var lastSignInAt: Timestamp?,

        var currentSignInIp: String?,

        // todo ip address validation regex?
        var lastSignInIp: String?,

        var lastUserAgent: String?,
        var currentUserAgent: String?,

        @OneToMany
        var children: List<Person>?,

        @ManyToOne
        @JoinColumn(name = "REVIEWED_BY")
        var reviewedBy: Person?,

        @ManyToOne
        @JoinColumn(name = "DELETED_BY")
        var deletedByUserId: Person?,

        @ManyToOne
        @JoinColumn(name = "CREATED_BY")
        var createdByUserId: Person?,

        @ManyToOne
        @JoinColumn(name = "UPDATED_BY")
        var updatedByUserId: Person?,

        @CreationTimestamp
        var createdAt: Instant,
        @UpdateTimestamp
        var updatedAt: Instant,

        var deletedAt: Instant?)


@Entity
data class Phone(
        @Id
        @Column(unique = true)
        var num: String,

        var carrier: String?,
        var smsGatewayEmailable: Boolean,
        var confirmationSentAt: Instant?,
        var confirmedAt: Instant?,
        var isDefault: Boolean)

@Entity
data class Email(@Id
                 var addreess: String,
                 @ManyToOne
                 var owner: Person,
                 var confirmationSentAt: Instant?,
                 var confirmedAt: Instant?,
                 var isDefault: Boolean,
                 @CreationTimestamp
                 var addedSince: Instant)


@Entity
@Immutable
data class ZipCode(
        @Id
        val zip: String,
        val city: String,
        val state: String,
        val lat: Double,
        val lng: Double)


@Embeddable
data class Name(var firstName: String?,
                var lastName: String?)