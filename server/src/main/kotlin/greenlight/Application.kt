package greenlight

import io.micronaut.context.ApplicationContext
import io.micronaut.runtime.Micronaut
import io.micronaut.runtime.Micronaut.build

object Application {
    @JvmStatic
    fun main(args: Array<String>) {
        build()
            .deduceEnvironment(false)
            .include("common")
            .packages("greenlight", "greenlight.entities")
            .mainClass(Application.javaClass)
            .start()
    }
}
