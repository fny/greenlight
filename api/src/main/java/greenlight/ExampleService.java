package greenlight;


import org.hibernate.Session;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.transaction.Transactional;

@Singleton
public class ExampleService {
    @Inject
    Session session;

    ExampleService() {}

    @Transactional
    public void doSomething() {
    }

    @Transactional
    public void doSomethingElse() {

    }
}
