package greenlight.etc

import org.hibernate.boot.model.naming.Identifier
import org.hibernate.boot.model.naming.PhysicalNamingStrategy
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment

/**
 * Converts camelCase to CAMEL_CASE
 */
class CamelToSnakeCaseNamingStrategy : PhysicalNamingStrategy {
    private fun convert(name: Identifier?): Identifier? {
        val regex = "([a-z])([A-Z])".toRegex();
        val replacement = "$1_$2";
        if (name == null) {
            // TODO: What is this for exactly?
            return null// Identifier("greenlight_wip", false)
        }

        return Identifier.toIdentifier(name.text.replace(regex, replacement).toLowerCase())
    }

    override fun toPhysicalCatalogName(
        name: Identifier?,
        jdbcEnvironment: JdbcEnvironment?
    ): Identifier? = convert(
        name
    )

    override fun toPhysicalSchemaName(
        name: Identifier?,
        jdbcEnvironment: JdbcEnvironment?
    ): Identifier? = convert(
        name
    )

    override fun toPhysicalTableName(
        name: Identifier,
        jdbcEnvironment: JdbcEnvironment?
    ): Identifier? = convert(
        name
    )

    override fun toPhysicalSequenceName(
        name: Identifier?,
        jdbcEnvironment: JdbcEnvironment?
    ): Identifier? = convert(
        name
    )

    override fun toPhysicalColumnName(
        name: Identifier?,
        jdbcEnvironment: JdbcEnvironment?
    ): Identifier? = convert(
        name
    )
}
