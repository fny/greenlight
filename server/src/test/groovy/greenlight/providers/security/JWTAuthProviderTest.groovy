package greenlight.providers.security

import io.micronaut.http.HttpRequest
import io.micronaut.http.HttpStatus
import io.micronaut.http.client.RxHttpClient
import io.micronaut.http.client.annotation.Client
import io.micronaut.http.client.exceptions.HttpClientResponseException
import io.micronaut.test.annotation.MicronautTest
import spock.lang.Ignore
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest
class JWTAuthProviderTest extends Specification {
    
    @Inject
    @Shared
    @Client("/")
    RxHttpClient http
    
    @Ignore
    def 'Requesting protected resources will give a HTTP Unauthorized response'() {
        when:
              http.toBlocking().exchange(HttpRequest.GET('/user'))
        then:
              def e = thrown(HttpClientResponseException)
              e.status == HttpStatus.UNAUTHORIZED
    }
}
