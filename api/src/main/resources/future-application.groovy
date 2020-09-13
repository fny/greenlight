def REQUIRED = true

class Environment {
    String name
    Environment() {
        this.name = System.getenv().get('GREENLIGHT_ENV') || 'development'
        if (!['development', 'test', 'production'].contains(this.name)) {
            throw new Exception("Unknown environment specified ${this.name}")
        }
    }
    def isDevelopment() { return GREENLIGHT_ENV == 'development' }
    def isTest() { return GREENLIGHT_ENV == 'test' }
    def isProduction() { return GREENLIGHT_ENV == 'production' }

    String fetch(key, default_ = null, required = false) {
        def value = System.getenv().get(key) || default_
        if (!value && required) {
            throw new Exception("Required environment variable ${key} is not set.")
        }
        return value
    }

    String DATABASE_URL() {
        if (this.isDevelopment()) {
            return 'postgres://localhost:5432/greenlight_development'
        }
        if (this.isTest()) {
            return 'postgres://localhost:5432/'
        }
        return nil
    }

    String DATABASE_SCHEMA() {
        def values = this.DATABASE_URL().split('/')
        return values[values.length - 1]
    }
}

def env = new Environment()


micronaut {
    application {
        name = "api"
    }

    server {
        ssl {
            enabled = env.isProduction()
        }
    }

    security {
        authentication = 'bearer'
        token {
            jwt {
                signatures {
                    secret: {
                        generator {
                            secret: env.fetch("JWT_GENERATOR_SIGNATURE_SECRET", env.isProduction() ? null : 'VERY_SECRET_TOKEN', REQUIRED)
                        }
                    }
                }
            }
        }
    }
}

datasources {
    default {
        url = "jdbc:${env.fetch("DATABASE_URL", env.DATABASE_URL(), REQUIRED)}"
        driverClassName = 'org.postgresql.Driver'
        // schema-generate
        schemaGenerate = 'CREATE_DROP'
        dialect = 'POSTGRES'
    }
}

jpa {
    default {
        // entity-scan
        entityScan {
            enabled = true
            packages = ['greenlight.entities']
        }
        properties {
            hibernate {
                hbm2ddl {
                    auto = 'none'
                }
                show_sql = true
                physical_naming_strategy = 'greenlight.etc.CamelToSnakeCaseNamingStrategy'
            }
        }
    }
}

liquibase {
    datasources {
        default {
            // default-schema
//            defaultSchema = env.DATABASE_SCHEMA()
            // change-log
            changeLog = 'classpath:db/liquibase-changelog.yml'
        }
    }
}
