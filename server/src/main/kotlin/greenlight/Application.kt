package greenlight

import io.micronaut.runtime.Micronaut.build

object Application {

    @JvmStatic
    fun main(args: Array<String>) {
        build().deduceEnvironment(false)
                .packages("greenlight")
                .mainClass(Application.javaClass)
                .start()
    }
}
