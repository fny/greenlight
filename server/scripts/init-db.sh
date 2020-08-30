#!/usr/bin/env bash

if ! command -v createuser &> /dev/null
then
  echo "createuser command not found. is postgresql installed?"
  exit
fi

if ! command -v pg_ctl &> /dev/null
then
  echo "pg_ctl command not found. is postgresql installed?"
  exit
fi

echo "Initializing new Postgres database in ../db"
mkdir -p ../db/postgres \
&& echo "ggrreenn" >> ../db/.password \
&& initdb -U greenlight --pwfile=../db/.password -E utf8 ../db/postgres \
&& rm ../db/.password

echo "Starting local postgresql server on port 13700"
pg_ctl restart -o "-p 13700" -D ../db/postgres -l ../db/logfile &

sleep 2 && echo "Creating covid database"
createdb -p 13700 -h localhost -U greenlight -O greenlight covid

