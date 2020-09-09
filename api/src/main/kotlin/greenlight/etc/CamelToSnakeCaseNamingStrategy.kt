package greenlight.etc

import org.hibernate.boot.model.naming.Identifier
import org.hibernate.boot.model.naming.PhysicalNamingStrategy
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment

/**
 * Converts camelCase to CAMEL_CASE
 */
class CamelToSnakeCaseNamingStrategy : PhysicalNamingStrategy {
        private fun convertToSnakeCase(identifier: Identifier): Identifier {
        val regex = "([a-z])([A-Z])"
        val replacement = "$1_$2"
        val newName: String = identifier.getText()
            .replace(regex, replacement)
            .toLowerCase()
        return Identifier.toIdentifier(newName)
    }

    override fun toPhysicalCatalogName(identifier: Identifier, jdbcEnv: JdbcEnvironment?): Identifier {
        return convertToSnakeCase(identifier)
    }

    override fun toPhysicalColumnName(identifier: Identifier, jdbcEnv: JdbcEnvironment?): Identifier {
        return convertToSnakeCase(identifier)
    }

    override fun toPhysicalSchemaName(identifier: Identifier, jdbcEnv: JdbcEnvironment?): Identifier {
        return convertToSnakeCase(identifier)
    }

    override fun toPhysicalSequenceName(identifier: Identifier, jdbcEnv: JdbcEnvironment?): Identifier {
        return convertToSnakeCase(identifier)
    }

    override fun toPhysicalTableName(identifier: Identifier, jdbcEnv: JdbcEnvironment?): Identifier {
        return convertToSnakeCase(identifier)
    }
}
