package greenlight.etc

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
const val STRENGTH = 12

object BCryptPasswordService {
    private val encoder = BCryptPasswordEncoder(STRENGTH)

    fun encode(rawPassword: String): String {
        return encoder.encode(rawPassword)
    }

    fun matches(rawPassword: String, encodedPassword: String): Boolean {
        return encoder.matches(rawPassword, encodedPassword)
    }
}
