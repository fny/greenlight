#! /bin/bash
set -e

while [[ "$#" -gt 0 ]]; do
    case $1 in
        -p|--production) env=production ;;
        -s|--staging) env=staging ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

[ -z $env ] && echo "You need to supply an environment" && exit

clean_up () {
    ARG=$?
    echo "> clean_up"
    if test -f .env.production.bak; then
      mv .env.production .env.staging
      rm .env.production
      mv .env.production.bak .env.production
    fi
    exit $ARG
}

trap clean_up EXIT


if [ "$env" == "production" ]; then
  yarn build
  firebase target:apply hosting production glit-app-prod
fi

if [ "$env" == "staging" ]; then
  mv .env.production .env.production.bak
  mv .env.staging .env.production
  yarn build
  firebase target:apply hosting staging glit-app-staging
  mv .env.production .env.staging
  rm .env.production
  mv .env.production.bak .env.production
fi

echo $env

# yarn build
# firebase deploy
