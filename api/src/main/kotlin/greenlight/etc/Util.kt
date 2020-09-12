package greenlight.etc

import io.micronaut.core.io.ResourceResolver
import io.micronaut.core.io.scan.ClassPathResourceLoader
import org.hibernate.Session
import org.hibernate.SessionFactory
import org.hibernate.Transaction
import java.lang.Exception
import java.net.URI
import java.security.SecureRandom
import javax.inject.Inject
import javax.inject.Singleton
import javax.validation.ConstraintViolation
import javax.validation.Validation
import kotlin.math.abs

class Util {
    companion object {
        private const val BASE58_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

        private val resourceLoader = ResourceResolver().getLoader(ClassPathResourceLoader::class.java).get()
        private val validator = Validation.buildDefaultValidatorFactory().validator

        // TODO: How to get the session factory?
        // @Inject
        // private lateinit var sessionFactory: SessionFactory

        @JvmStatic
        fun randomBase58(length: Int): String {
            return SecureRandom().ints(length.toLong()).toArray().map { i ->
                BASE58_ALPHABET[abs(i) % 58]
            }.joinToString("")
        }

        @JvmStatic
        fun resourceURI(path: String): URI {
            return resourceLoader.getResource("classpath:$path").get().toURI()
        }



        //
        // Validations
        //

        @JvmStatic
        @JvmOverloads // Needed for optional arguments to work in Groovy
        fun <T> hasConstraintViolation(
            violations: Set<ConstraintViolation<T>>,
            property: String,
            message: String? = null
        ): Boolean {
            return violations.any {
                it.propertyPath.toString() == property && (message == null || it.message == message)
            }
        }

        @JvmStatic
        fun <T> findConstraintViolations(
            violations: Set<ConstraintViolation<T>>,
            property: String
        ): List<ConstraintViolation<T>> {
            return violations.filter {
                it.propertyPath.toString() == property
            }
        }

        @JvmStatic
        fun <T> validate(obj: T): Set<ConstraintViolation<T>> {
            return validator.validate(obj)
        }

        // TODO: How to get the session factory?
        // @JvmStatic
        // fun withinTransaction(work: (sess: Session) -> Void) {
        //     withinTransaction(sessionFactory, work)
        // }

        @JvmStatic
        fun withinTransaction(sf: SessionFactory, work: (sess: Session) -> Void) {
            val sess = sf.openSession()
            val tx: Transaction = sess.beginTransaction()
            try {
                work(sess)
                tx.commit()
            }
            catch (e: Exception) {
                tx.rollback()
                throw e
            }
            finally {
                sess.close()
            }
        }
    }
}
