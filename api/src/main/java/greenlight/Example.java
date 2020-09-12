package greenlight;

import io.micronaut.context.annotation.Value;

import javax.inject.Singleton;

@Singleton
public class Example {
    String name;
    Example(@Value("{micronaut.application.name}") String myproperty) {
        this.name = myproperty;
    }
}
