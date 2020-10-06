# README

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## TODO

On Error, return the proper errors object

Handle ERR_CONNECTION_REFUSED


curl -g "https://api.honeybadger.io/v1/deploys? \
  deploy[environment]=production& \
  deploy[local_username]=Faraz Yashar& \
  deploy[repository]=git@github.com:user/repo.git& \
  deploy[revision]=b6826b8& \
  api_key=1a49717c"


## Yason API

We'll be using this for version 2 of the API.

Goals:

 - Hypermedia sanity
 - Add more flexibility than JSON API
 - Add actions
 - Allow for bulk operations
 - Allow for remote/client sync
 - Allow for conflict resolution
 - Smaller payloads


### "Primitive" Types

 - Boolean:
 - Password:
 - Symbol:
 - String:
 - Integer:
 - BigInt:
 - Int64:
 - Int32:
 - Float:
 - Double:
 - Date:
 - DateTime:
 - Enum:
 - Array:

### Actions

### Errors

### Pagination Meta

### Extensions
