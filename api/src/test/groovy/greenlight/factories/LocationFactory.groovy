package greenlight.factories

import greenlight.entities.Location
import nl.topicus.overheid.javafactorybot.Factory
import nl.topicus.overheid.javafactorybot.definition.Attribute

class LocationFactory extends Factory<Location> {
  Map<String, Attribute> attributes = [
      name : value {faker.university().name() },
      category: value {Location.Categories.SCHOOL.getValue() },
      permalink: value { "#{get(name)}" }
  ]
}
