package greenlight.controllers

import io.micronaut.context.ApplicationContext
import io.micronaut.http.HttpMethod
import io.micronaut.http.HttpRequest
import io.micronaut.http.client.RxHttpClient
import io.micronaut.http.client.annotation.Client
import io.micronaut.runtime.server.EmbeddedServer
import io.micronaut.test.annotation.MicronautTest
import spock.lang.AutoCleanup
import spock.lang.Shared
import spock.lang.Specification

import javax.inject.Inject

@MicronautTest
class UserControllerTest extends Specification {

  @Shared @AutoCleanup EmbeddedServer server = ApplicationContext.run(EmbeddedServer)
  @Shared @Inject @Client("/user") RxHttpClient httpClient
}
