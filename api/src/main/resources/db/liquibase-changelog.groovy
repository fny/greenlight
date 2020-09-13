import java.nio.file.DirectoryStream
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
def basePath = new File(getClass().protectionDomain.codeSource.location.path).parent,
def migrationsDir = Paths.get(basePath, 'migrations')

DirectoryStream<Path> paths = Files.newDirectoryStream(migrationsDir, "*.sql")

for (p in paths) {
    println(p.getFileName())
}
//
databaseChangeLog {
    for (p in paths) {
        changeSet {
            id = p.getFileName()
            author = "greenlight"
            changes {
                sqlFile {
                    path = p.toString().replace(basePath, "")
                }
            }
        }
    }
}
