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

clean_up() {
    ARG=$?
    echo "> clean_up"
    if test -f .env.production.bak; then
      mv .env.production .env.staging
      rm .env.production
      mv .env.production.bak .env.production
    fi
    exit $ARG
}

confirmation() {
  while true; do
    read -r -p "This will deploy to $1. Are you sure? [y/n] " input

    case $input in
      [yY][eE][sS]|[yY])
      echo "Deploying to $1"
      break;;
      [nN][oO]|[nN])
      echo "Quitting..."
      exit 0;;
      *)
      echo "Invalid input... Let's try that agiain!";;
    esac
  done
}

assert_branch() {
  branch=`git rev-parse --abbrev-ref HEAD`
  if [ "$1" != "$branch" ]; then
    echo "You need to be on the same branch as the deploy target!"
    echo "Right now you're on the $branch branch but you're trying to deploy to $1"
  fi
}

trap clean_up EXIT

if [ "$env" == "production" ]; then
  assert_branch $env
  confirmation $env
  yarn build
  firebase deploy --only hosting:production
fi

if [ "$env" == "staging" ]; then
  assert_branch $env
  confirmation $env
  mv .env.production .env.production.bak
  cp .env.staging .env.production
  yarn build
  firebase deploy --only hosting:staging
  rm .env.production
  mv .env.production.bak .env.production
fi
