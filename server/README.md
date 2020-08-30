# Dependencies
 
Hello, to get started you're gonna need:

- Grab https://sdkman.io to manage all Java related installations
 etc. `$ curl -s "https://get.sdkman.io" | bash`

- JDK 8 or higher (Oracle version preferred, but openjdk is fine too) 
    - `sdk install openjdk` or `brew install openjdk` 
    - Make sure `JAVA_HOME` path is set

- Intellij IDEA (Grab the Ultimate edition I'll give you an activation bypass)
    - https://www.jetbrains.com/idea/download/#section=mac
 
- PostgreSQL installed. (See _Initializing Local Database_)

- `brew install k6`
 
 **Optionals:** 
 - micronaut cli tool: `sdk install micronaut`

# Intellij Config
In intellij Settings, search for the quoted text and follow the steps as
 documented:
 
1) `Preferences | Build, Execution, Deployment | Compiler | Annotation
 Processors`
    - **Enable annotation processing** - Checked
2) `Preferences | Plugins` 
    - **Micronaut** installed/enabled
3) `Preferences | Build, Execution, Deployment | Build Tools | Maven | Runner` 
    - **Delegate IDE build/run actions to Maven** - Checked


## Initializing Local PostgreSQL
I've created a simple script under `scripts/init-db.sh`, which:

 1) creates a new Postgres db cluster into `db/postgres` folder
 2) sets up `greenlight` user its superuser, `ggrreenn` as passowrd
 3) starts the postmaster, running on port 13700
 4) creates a new db named `covid` into the cluster, using the account from step 3
 
    **notes:** 
    - these values are used in `src/main/resources/application-XXX.yml`
    - posgres logfile is located at `db/logfile`
 
 The script uses relative paths, therefore you should cd into scripts and then `/bin
 /bash init-db.sh`  
