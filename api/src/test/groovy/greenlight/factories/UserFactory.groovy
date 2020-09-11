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
