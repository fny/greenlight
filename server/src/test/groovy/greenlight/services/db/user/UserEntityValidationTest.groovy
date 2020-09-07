package greenlight.services.db.user

import greenlight.models.entities.User
import io.micronaut.context.ApplicationContext
import io.micronaut.test.annotation.MicronautTest
import org.hibernate.SessionFactory
import spock.lang.AutoCleanup
import spock.lang.Shared
import spock.lang.Specification
import spock.lang.Unroll

import javax.inject.Inject
import javax.validation.ConstraintViolation
import javax.validation.ConstraintViolationException
import javax.validation.Validator

@MicronautTest
class UserEntityValidationTest extends Specification {
    
    @Inject
    SessionFactory sf
    
    @AutoCleanup
    @Shared
    ApplicationContext ctx = ApplicationContext.run()
    @Shared
    Validator validator = ctx.getBean(Validator)
    
    def 'Creating users with correct info validated fine'() {
        
        when:
              def user = new User(UUID.randomUUID(), "Nima", "G", "nima@gmail.com", "+1 2265000405")
        then:
              def validate = validator.validate(user)
              validate.isEmpty()
    }
    
    def 'Blank names are not allowed'(firstName, lastName, email, phone) {
        when:
              def user = new User(UUID.randomUUID(), firstName, lastName, email, phone)
        
        then:
              !validator.validate(user).isEmpty()
        
        where:
              firstName | lastName | email            | phone
              ""        | ""       | "hellO@test.com" | "+1232456123"
              ""        | "GG"     | "gg@gmng.com"    | "+1231234124"
              "Alo"     | ""       | "asd@cc.com"     | "+12323232323"
    }
    
    
    @Unroll
    def 'Invalid emails are caught'(String email, Integer num) {
        when:
              def userToSave = new User(UUID.randomUUID(), "test", "test", email, String.valueOf(num))
        
        then:
              !validator.validate(userToSave).isEmpty()
        
        where:
              email                | num
              "asd@"               | 1
              "trwr@gmail,com"     | 2
              "@nomail.com"        | 3
              "nima@nomailcom"     | 4
              "nimanomail.com"     | 5
              "asd@@imanomail.com" | 6
    }
    
    def 'phone numbers are validated'(phone, isValid) {
        when:
              def userToSave = new User(UUID.randomUUID(), "test", "test", "test@test.com", phone)
        then:
              def validationResult = validator.validate(userToSave)
              validationResult.isEmpty() == isValid
        
        where:
              phone              | isValid
              "+1"               | false
              "+224214"          | false
              "123"              | false
              "+1 999 885"       | false
              " + 1 324 213 3"   | false
              "+1 234 56 78"     | false
              "+1 221 1144"      | false
              "+1 9999999"       | false
              "-123"             | false
              "+12265040"        | false
              "+16678877"        | false
              "+16666666"        | false
              "+1 666 666 66 66" | false
              "+1 226 500 04 05" | true
    }
}
