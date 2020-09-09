package greenlight.etc


import java.security.SecureRandom
import kotlin.math.abs

val BASE58_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

fun randomBase58(length: Int): String {
     return SecureRandom().ints(length.toLong()).toArray().map {
          i -> BASE58_ALPHABET[abs(i) % 58]
     }.joinToString("")
}
