package greenlight.entities

import greenlight.etc.Util
import greenlight.factories.UserFactory
import io.micronaut.context.ApplicationContext
import io.micronaut.test.annotation.MicronautTest
import org.hibernate.SessionFactory
import spock.lang.AutoCleanup
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject
import javax.transaction.Transactional
import javax.validation.ConstraintViolationException
import javax.validation.Validator

@MicronautTest
class UserSpec extends Specification {

    @Inject
    SessionFactory sessionFactory

    @AutoCleanup
    @Shared
    ApplicationContext ctx = ApplicationContext.run()
    @Shared
    Validator validator = ctx.getBean(Validator)

    def "Generates a UUID for an id"() {
        when:
        UUID.fromString(new User().id.toString())
        then:
        notThrown(IllegalArgumentException)
    }

    def "Validates presence of firstName and lastName"() {
        when:
        def expectedMessage = "must not be blank"
        def user = new User()


        def violationsNull = validator.validate(user)
        user.firstName = ""
        user.lastName = ""
        def violationsBlank = validator.validate(user)

        then:
        Util.findConstraintViolations(violationsNull, "firstName").get(0).message == expectedMessage
        Util.findConstraintViolations(violationsNull, "lastName").get(0).message == expectedMessage

        Util.findConstraintViolations(violationsBlank, "firstName").get(0).message == expectedMessage
        Util.findConstraintViolations(violationsBlank, "lastName").get(0).message == expectedMessage
    }
    def "Does not persist an invalid user"() {
        expect:
        Util.withinTransaction(sessionFactory) { sess ->
            sess.save(new User())
        }
    }

    def "fails to save an invalid user"() {
        when:
        Util.withinTransaction(sessionFactory) {
            sess -> sess.save(new User())
        }
        then:
        thrown ConstraintViolationException
    }

    def "saves a valid user"() {
        when:
        def user = new UserFactory().build()
        Util.withinTransaction(sessionFactory) {
            sess -> sess.save(user)
        }

        User foundUser;
        Util.withinTransaction((sessionFactory)) {
            sess ->
                foundUser = sess.find(User.class, user.id)
        }
        then:
        user.id == foundUser.id
        user.firstName == foundUser.firstName
        user.lastName == foundUser.lastName
        user.lastName == foundUser.lastName
        user == foundUser
    }

    def "can create child parent relationships"() {
        User parent = new UserFactory().build()
        User child = new UserFactory().build()
        child.lastName = parent.lastName

        Util.withinTransaction(sessionFactory) {
            sess ->
                sess.save(parent)
                sess.save(child)
                parent.children.add(child)
                sess.save(parent)
        }

        User foundParent;
        User foundChild
        Util.withinTransaction((sessionFactory)) {
            sess ->
                foundParent = sess.find(User.class, parent.id)
                foundChild = sess.find(User.class, child.id)
        }

        expect:
        foundParent.children.contains(child)
        foundChild.parents.contains(parent)
        !foundChild.isParent()
        foundChild.isChild()
        foundParent.isParent()
        !foundParent.isChild()
    }

    def "setting a phone number reformats it to the E.164 format"(String number, String formatted) {
        expect:
        def user = new User()
        user.setMobileNumber(number)
        user.mobileNumber == formatted

        where:
        number            | formatted
        "(330) 333-2729"  | "+13303332729"
        "330-333-2729"    | "+13303332729"
        "555-555-5555"    | "+15555555555"
        "555"             | "+1555"
    }

    def "validates phone numbers"(String number, boolean isInvalid) {
        expect:
        def user = new User()
        user.setMobileNumber(number)
        def violations = Util.validate(user)
        Util.hasConstraintViolation(violations, "mobileNumber") == isInvalid

        where:
        number            | isInvalid
        "(330) 333-2729"  | false
        "330-333-2729"    | false
        "555-555-5555"    | true
        "555"             | true
    }

    def "validates zip code"(String zip, boolean isInvalid) {
        expect:
        def user = new User()
        user.setZipCode(zip)
        def violations = Util.validate(user)
        def result = Util.hasConstraintViolation(violations, "zipCode")
        result == isInvalid

        where:
        zip               | isInvalid
        "32779"           | false
        "32779-3014"      | false
        "3219"            | true
        "32774-2"         | true
    }

    @Transactional
    def "transactional"() {
        expect:
        def user = new UserFactory().build()
        def sess = sessionFactory.openSession()
        sess.save(user)
        sess.close()
        "1" == "1"
    }
}
