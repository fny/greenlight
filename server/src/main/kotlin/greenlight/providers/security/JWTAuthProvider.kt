package greenlight.providers.security

import greenlight.services.db.user.PersonRepository
import io.micronaut.http.HttpRequest
import io.micronaut.security.authentication.*
import io.reactivex.BackpressureStrategy
import io.reactivex.Flowable
import io.reactivex.FlowableEmitter
import org.reactivestreams.Publisher
import org.slf4j.LoggerFactory
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class JWTAuthProvider : AuthenticationProvider {
  
  @Inject lateinit var personRepo : PersonRepository
  val logger = LoggerFactory.getLogger(this::class.java)
  
  
  override fun authenticate(httpRequest : HttpRequest<*>?,
                            authenticationRequest : AuthenticationRequest<*, *>) : Publisher<AuthenticationResponse> {
    return Flowable.create({ emitter : FlowableEmitter<AuthenticationResponse> ->
                             // todo actually check userRepo for such identity and password
                             logger.info(
                                 "Authenticating user ${authenticationRequest.identity}")
  
                             if (authenticationRequest.identity == "test") {
                               emitter.onNext(
                                   UserDetails(authenticationRequest.identity as String,
                                               listOf("student")))
                             } else {
                               emitter.onError(
                                   AuthenticationException(AuthenticationFailed()))
                             }
                             emitter.onComplete()
                           }, BackpressureStrategy.ERROR)
  }
}
