## Feature security documentation

- [Micronaut Micronaut Security documentation](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html)

## Feature liquibase documentation

- [Micronaut Liquibase Database Migration documentation](https://micronaut-projects.github.io/micronaut-liquibase/latest/guide/index.html)

- [https://www.liquibase.org/](https://www.liquibase.org/)

## Feature hibernate-jpa documentation

- [Micronaut Hibernate JPA documentation](https://micronaut-projects.github.io/micronaut-sql/latest/guide/index.html#hibernate)

## Feature jdbc-hikari documentation

- [Micronaut Hikari JDBC Connection Pool documentation](https://micronaut-projects.github.io/micronaut-sql/latest/guide/index.html#jdbc)

## Feature acme documentation

- [Micronaut ACME documentation](https://micronaut-projects.github.io/micronaut-acme/latest/guide/index.html)

## Feature management documentation

- [Micronaut Micronaut Management documentation](https://docs.micronaut.io/latest/guide/index.html#management)

## Feature http-client documentation

- [Micronaut Micronaut HTTP Client documentation](https://docs.micronaut.io/latest/guide/index.html#httpClient)

## Feature security-jwt documentation

- [Micronaut Micronaut Security JWT documentation](https://micronaut-projects.github.io/micronaut-security/latest/guide/index.html)

## Feature hibernate-validator documentation

- [Micronaut Hibernate Validator documentation](https://micronaut-projects.github.io/micronaut-hibernate-validator/latest/guide/index.html)

TODO:
https://medium.com/@benlucchesi/https-medium-com-benlucchesi-micronaut-gorm-liquibase-an-implementation-guide-f607d559ca16


```groovy
package greenlight.factories

import greenlight.entities.User
import nl.topicus.overheid.javafactorybot.Factory
import nl.topicus.overheid.javafactorybot.definition.Attribute

class UserFactory extends Factory<User> {
  Map<String, Attribute> attributes = [
    firstName : value { faker.name().firstName() },
    lastName : value { faker.name().lastName() },
    email : value { "${get("firstName")}.${get("lastName")}@example.com".toLowerCase() },
  ]
}

```
