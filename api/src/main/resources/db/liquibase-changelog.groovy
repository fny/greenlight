databaseChangeLog:
  - changeSet:
      id:  2020-09-10T154856Z-configure-database.sql
      author: faraz
      changes:
      -  sqlFile:
          path: db/migrations/2020-09-10T154856Z-configure-database.sql

  - changeSet:
      id:  2020-09-10T154908Z-create-users-table.sql
      author: faraz
      changes:
      -  sqlFile:
          path: db/migrations/2020-09-10T154908Z-create-users-table.sql

  - changeSet:
      id:  2020-09-10T154926Z-create-parents-children-table.sql
      author: faraz
      changes:
      -  sqlFile:
          path: db/migrations/2020-09-10T154926Z-create-parents-children-table.sql

  - changeSet:
      id:  2020-09-12T155009Z-create-locations-table
      author: faraz
      changes:
      -  sqlFile:
          path: db/migrations/2020-09-12T155009Z-create-locations-table.sql
