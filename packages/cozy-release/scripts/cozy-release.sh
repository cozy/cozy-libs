#!/bin/sh
command=$1
shift

case "$command" in
  start ) if [[ ! $1 == --* ]]; then
      remote=$1; shift;
    fi ;;
  beta ) if [[ ! $1 == --* ]]; then
      remote=$1; shift;
    fi ;;
  stable ) if [[ ! $1 == --* ]]; then
      remote=$1; shift;
    fi ;;
  patch ) if [[ ! $1 == --* ]]; then
      version=$1; shift;
    fi
    if [[ ! $1 == --* ]]; then
      remote=$1; shift;
    fi;;
esac

while true; do
  case "$1" in
    --no-push ) NO_PUSH=true; shift ;;
    * ) break ;;
  esac
done

read_current_version() {
  current_version=$(cat package.json | jq -rc '.version')
}

compute_next_version() {
  type=${2:-minor}
  IFS='.' read -r -a array <<< "$1"
  major=${array[0]}
  minor=${array[1]}
  patch=${array[2]}

  case "$type" in
    major ) major=$(expr $major + 1); minor="0"; patch="0";;
    minor ) minor=$(expr $minor + 1); patch="0";;
    patch ) patch=$(expr $patch + 1);
  esac

  next_version="$major.$minor.$patch"
}

bump_version() {
  remote=$1
  version=$2
  echo "☁️ cozy-release: Bumping version to $version"

  jq '.version = $version' --arg version $version package.json > package.temp.json && mv package.temp.json package.json
  jq '.version = $version' --arg version $version manifest.webapp > manifest.temp.webapp && mv manifest.temp.webapp manifest.webapp

  git add package.json
  git add manifest.webapp

  git commit -m "chore: Bump version $version 🚀"

  if [ ! $NO_PUSH ]; then
    git push $remote HEAD
  fi
}

assert_release_or_patch() {
  is_release=`git branch | grep "* release-"`
  is_patch=`git branch | grep "* patch-"`
  if [[ -z ${is_release// } && -z ${is_patch// } ]]; then
    echo "❌ cozy-release: You can only tag beta or stable version on release or patch branch. Please check out a release or a patch branch and try again."
    exit 1
  fi
}

get_existing_stable_tag() {
  version=$1
  existing_stable_tag=`git tag --list | grep "^$version\$"`
}

tag_beta() {
  remote=$1

  read_current_version

  get_existing_stable_tag $current_version
  if [[ ! -z "${existing_stable_tag// }" ]]; then
    echo "❌ cozy-release: Version $current_version has already been released as stable. You should not release new beta again. Start a new release or patch the $current_version version."
    exit 1
  fi

  beta_number="1"

  beta_tag="$current_version-beta.$beta_number"

  while git tag --list | egrep -q "^$beta_tag$"
  do
      beta_number=`expr $beta_number + 1`
      beta_tag="$current_version-beta.$beta_number"
  done

  echo "☁️ cozy-release: Tagging $beta_tag"
  git tag $beta_tag
  if [ ! $NO_PUSH ]; then
    git push $remote $beta_tag
  fi
}

tag_stable() {
  remote=$1

  read_current_version

  get_existing_stable_tag $current_version
  if [[ ! -z "${existing_stable_tag// }" ]]; then
    echo "❌ cozy-release: Version $current_version has already been released as stable. Start a new release or patch the $current_version version."
    exit 1
  fi

  echo "☁️ cozy-release: Tagging $current_version"
  git tag $current_version

  if [ ! $NO_PUSH ]; then
    git push $remote $current_version
  fi
}

warn_about_start() {
  remote=$1
  remote_url=`git remote get-url --push $remote` || exit 1
  echo "⚠️  cozy-release start will push a new release branch to $remote ($remote_url) and will commit a version update to $remote/master."
  echo "You can change the remote repository by running 'cozy-release start <remote>'. "
  echo "To not push anything to $remote, run 'cozy-release start <remote> --no-push.'"
  read -p "Are you sure you want to continue ? (Y/n): " user_response
  if [ $user_response != "Y" ]
  then
    exit 0
  fi
}

warn_about_beta() {
  remote=$1
  remote_url=`git remote get-url --push $remote` || exit 1
  echo "⚠️  cozy-release beta will push a new beta tag to $remote ($remote_url), which will trigger continuous integration builds."
  echo "You can change the remote repository by running 'cozy-release beta <remote>'. "
  echo "To not push anything to $remote, run 'cozy-release beta <remote> --no-push.'"
  read -p "Are you sure you want to continue ? (Y/n): " user_response
  if [ $user_response != "Y" ]
  then
    exit 0
  fi
}

warn_about_stable() {
  remote=$1
  remote_url=`git remote get-url --push $remote` || exit 1
  echo "⚠️  cozy-release stable will push a new stable tag to $remote ($remote_url), which will trigger continuous integration builds, and publish a new PRODUCTION version to registry."
  echo "You can change the remote repository by running 'cozy-release stable <remote>'. "
  echo "To not push anything to $remote, run 'cozy-release stable <remote> --no-push.'"
  read -p "Are you sure you want to continue ? (Y/n): " user_response
  if [ $user_response != "Y" ]
  then
    exit 0
  fi
}

warn_about_patch() {
  remote_url=`git remote get-url --push $remote` || exit 1
  echo "⚠️  cozy-release patch <version> will push a new patch branch to $remote ($remote_url)."
  echo "You can change the remote repository by running 'cozy-release patch <version> <remote>'. "
  echo "To not push anything to $remote, run 'cozy-release patch <version> <remote> --no-push.'"
  read -p "Are you sure you want to continue ? (Y/n): " user_response
  if [ $user_response != "Y" ]
  then
    exit 0
  fi
}

fetch_remote () {
  remote=$1
  echo "☁️ cozy-release: Fetching $remote"
  git fetch --tags $remote
}

get_existing_release_branch() {
  existing_release_branch=`git branch --all | grep "remotes/$remote/release-" | sed -e "s/  remotes\/$remote\///"`
}

start() {
  remote=$1
  if [ ! $NO_PUSH ]; then
    warn_about_start $remote
  fi

  fetch_remote $remote

  get_existing_release_branch

  if [[ ! -z "${existing_release_branch// }" ]]; then
    echo "❌ cozy-release: A release branch ($remote/$existing_release_branch) already exists. End the previous release or delete $remote/$existing_release_branch before starting a new release."
    exit 1
  fi

  echo "☁️ cozy-release: Checking out master branch"
  git checkout master && git pull

  read_current_version
  release_branch=release-$current_version

  echo "☁️ cozy-release: Creating branch $release_branch"
  git checkout -b $release_branch
  if [ ! $NO_PUSH ]; then
    git push $remote HEAD
  fi

  compute_next_version $current_version
  git checkout master
  bump_version $remote $next_version

  git checkout $release_branch
  tag_beta $remote
}

beta () {
  assert_release_or_patch

  remote=$1
  if [ ! $NO_PUSH ]; then
    warn_about_beta $remote
  fi

  tag_beta $remote
}

stable () {
  assert_release_or_patch

  remote=$1
  if [ ! $NO_PUSH ]; then
    warn_about_stable $remote
  fi

  tag_stable $remote
}

patch () {
  remote=$1
  version=$2
  if [[ -z ${version// } ]]; then
    echo "❌ cozy-release: cozy-release patch needs a version, please run 'cozy-release patch <version>'."
    exit 1
  fi

  get_existing_stable_tag $version
  if [[ -z "${existing_stable_tag// }" ]]; then
    echo "❌ cozy-release: No stable version $version has been released. This version cannot be patched."
    exit 1
  fi

  if [ ! $NO_PUSH ]; then
    warn_about_patch $remote
  fi

  fetch_remote $remote

  compute_next_version $version patch
  patch_branch="patch-$next_version"

  already_existing_patch_branch=`git branch --all | grep "^remotes/$remote/$patch_branch$"`

  if [[ ! -z "${already_existing_patch_branch// }" ]]; then
    echo "❌ cozy-release: A patch branch ($remote/$already_existing_patch_branch) already exists."
    exit 1
  fi

  echo "☁️ cozy-release: Creating branch $patch_branch"
  git checkout -b $patch_branch $version
  if [[ $? -ne 0 ]]; then
    exit 1
  fi

  echo "☁️ cozy-release: Bump version to $next_version"
  bump_version $remote $next_version

  if [ ! $NO_PUSH ]; then
    git push $remote HEAD
  fi
}

case "$command" in
  start ) start ${remote:-origin} ;;
  beta ) beta ${remote:-origin} ;;
  stable ) stable ${remote:-origin} ;;
  patch ) patch ${remote:-origin} $version;;
esac
