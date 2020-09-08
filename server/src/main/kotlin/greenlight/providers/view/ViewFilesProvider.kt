package greenlight.providers.view

import com.google.template.soy.SoyFileSet
import io.micronaut.core.io.ResourceLoader
import io.micronaut.views.soy.SoyFileSetProvider
import io.micronaut.views.soy.SoySauceViewsRenderer
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ViewFilesProvider : SoyFileSetProvider {

    @Inject
    lateinit var resourceLoader: ResourceLoader

    val fileSet: SoyFileSet by lazy {
        SoyFileSet.builder()
                .add(resourceLoader.getResource("views/dashboard.soy")
                             .get())
                .build()
    }

    override fun provideSoyFileSet(): SoyFileSet {
        return fileSet
    }
}