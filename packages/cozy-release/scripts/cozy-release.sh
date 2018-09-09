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
  end ) if [[ ! $1 == --* ]]; then
      remote=$1; shift;
    fi
esac

while true; do
  case "$1" in
    -h|--help ) HELP=true; shift;;
    --no-push ) NO_PUSH=true; shift ;;
    * ) UNKNOWN_OPTION=$1; shift; break;;
  esac
done

assert_command_exists () {
  if [ ! $(command -v $1) ]; then
    echo >&2 "cozy-release requires $1 but it's not installed. See $2 to install $1."
    exit 1
  fi
}

assert_jq_exists () {
  assert_command_exists jq "https://stedolan.github.io/jq/"
}

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

  echo "$major.$minor.$patch"
}

get_patched_version() {
  IFS='.' read -r -a array <<< "$1"
  major=${array[0]}
  minor=${array[1]}
  patch=${array[2]}
  patch=$(expr $patch - 1);
  echo "$major.$minor.$patch"
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
  version=$2
  next_version=`compute_next_version $version`
  remote_url=`git remote get-url --push $remote` || exit 1
  echo "⚠️  cozy-release start will:"
  echo "  * push a new release branch release-$version to $remote ($remote_url)"
  echo "  * Tag a $version-beta.1 version and push it to $remote"
  echo "  * Bump master version to $next_version and push it to $remote"
  read -p "Continue ? (Y/n): " user_response
  if [ $user_response != "Y" ]
  then
    exit 0
  fi
}

warn_about_beta() {
  remote=$1
  remote_url=`git remote get-url --push $remote` || exit 1
  echo "⚠️  cozy-release beta will push a new beta tag to $remote ($remote_url), which will trigger continuous integration builds."
  echo "You can change the remote repository by running 'cozy-release beta [remote]'. "
  echo "To not push anything to $remote, run 'cozy-release beta [remote] --no-push.'"
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
  echo "You can change the remote repository by running 'cozy-release stable [remote]'. "
  echo "To not push anything to $remote, run 'cozy-release stable [remote] --no-push.'"
  read -p "Are you sure you want to continue ? (Y/n): " user_response
  if [ $user_response != "Y" ]
  then
    exit 0
  fi
}

warn_about_patch() {
  remote_url=`git remote get-url --push $remote` || exit 1
  echo "⚠️  cozy-release patch [version] will push a new patch branch to $remote ($remote_url)."
  echo "You can change the remote repository by running 'cozy-release patch [version] [remote]'. "
  echo "To not push anything to $remote, run 'cozy-release patch [version] [remote] --no-push.'"
  read -p "Are you sure you want to continue ? (Y/n): " user_response
  if [ $user_response != "Y" ]
  then
    exit 0
  fi
}

warn_about_end() {
  remote_url=`git remote get-url --push $remote` || exit 1
  echo "⚠️  cozy-release end [remote] will merge into master and delete permanently the current release or patch branch from $remote ($remote_url)."
  echo "You can change the remote repository by running 'cozy-release end [remote]'. "
  echo "To not push anything to $remote, run 'cozy-release end [remote] --no-push.'"
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
  if [ $HELP ]; then
    show_start_help
    exit 0
  fi

  assert_jq_exists

  remote=$1
  if [ ! -f "package.json" ]; then
    echo "☁️ cozy-release: Creating package.json"
    echo "{\"version\":\"0.0.0\"}" > package.json
  fi

  if [ ! -f "manifest.webapp" ]; then
    echo "☁️ cozy-release: Creating manifest.webapp"
    echo "{\"version\":\"0.0.0\"}" > manifest.webapp
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

  if [ ! $NO_PUSH ]; then
    warn_about_start $remote $current_version
  fi

  release_branch=release-$current_version

  echo "☁️ cozy-release: Creating branch $release_branch"
  git checkout -b $release_branch
  if [ ! $NO_PUSH ]; then
    git push $remote HEAD
  fi

  next_version=`compute_next_version $current_version`
  git checkout master
  bump_version $remote $next_version

  git checkout $release_branch
  tag_beta $remote
}

beta () {
  if [ $HELP ]; then
    show_beta_help
    exit 0
  fi

  assert_jq_exists
  assert_release_or_patch

  remote=$1
  if [ ! $NO_PUSH ]; then
    warn_about_beta $remote
  fi

  git push $remote HEAD
  tag_beta $remote
}

stable () {
  if [ $HELP ]; then
    show_stable_help
    exit 0
  fi

  assert_jq_exists
  assert_release_or_patch

  remote=$1
  if [ ! $NO_PUSH ]; then
    warn_about_stable $remote
  fi

  git push $remote HEAD
  tag_stable $remote
}

patch () {
  if [ $HELP ]; then
    show_patch_help
    exit 0
  fi

  remote=$1
  version=$2
  if [[ -z ${version// } ]]; then
    echo "❌ cozy-release: cozy-release patch needs a version, please run 'cozy-release patch [version]'."
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

  next_version=`compute_next_version $version patch`
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

end () {
  if [ $HELP ]; then
    show_end_help
    exit 0
  fi

  assert_release_or_patch

  remote=$1

  if [ ! $NO_PUSH ]; then
    warn_about_end $remote
  fi

  is_release=`git branch | grep "* release-"`
  is_patch=`git branch | grep "* patch-"`

  git fetch $remote

  read_current_version

  if [[ ! -z ${is_release// } ]]; then
    end_release $remote $current_version
    exit 0
  fi

  if [[ ! -z ${is_patch// } ]]; then
    end_patch $remote $current_version
    exit 0
  fi

  echo "❌ cozy-release: Unexpected branch name."
  exit 1
}

end_release() {
  remote=$1
  version=$2
  branch="release-$version"

  get_existing_stable_tag $version
  if [[ -z "${existing_stable_tag// }" ]]; then
    echo "❌ cozy-release: Version $version has not been tagged as stable yet. You can do it by running 'cozy-release stable'."
    read -p "Continue anyway and end this release ? (Y/n): " user_response
    if [[ $user_response != "Y" ]]; then
      exit 0
    fi
  fi

  echo "☁️ cozy-release: Pulling $branch"
  git pull $remote $branch

  echo "☁️ cozy-release: Merging $branch into master"
  git checkout master
  if ! git pull $remote master; then
    echo "❌ cozy-release: Pull failed"
    exit 1
  fi

  if ! git merge $branch --no-edit; then
    echo "❌ cozy-release: Merge failed, fix it manually and then delete branch $branch."
    exit 1
  fi

  echo "☁️ cozy-release: Deleting $branch"
  git branch -D $branch

  if [[ ! $NO_PUSH ]]; then
    git push $remote :$branch
  fi

  echo "☁️ cozy-release: Release ended successfully."
}

end_patch() {
  remote=$1
  version=$2
  branch="patch-$version"

  get_existing_stable_tag $version
  if [[ -z "${existing_stable_tag// }" ]]; then
    echo "❌ cozy-release: Version $version has not been tagged as stable yet. You can do it by running 'cozy-release stable'."
    read -p "Continue anyway and end this patch ? (Y/n): " user_response
    if [[ $user_response != "Y" ]]; then
      exit 0
    fi
  fi

  echo "☁️ cozy-release: Pulling $branch"
  git pull $remote $branch

  # We do not want the first commit of patch-$version because it's a
  # version bump generated by cozy-release.
  # So we cherry-pick every patch commit except the first one.

  patched_version=`get_patched_version $version`
  first_patch_commit_sha1=`git rev-list $patched_version..$branch | tail -1`

  echo "☁️ cozy-release: Cherry-picking $branch into master"
  git checkout master

  for sha1 in $(git rev-list $patched_version..$branch --reverse) ; do
    if [[ "$sha1" != "$first_patch_commit_sha1" ]]; then
      if ! git cherry-pick $sha1; then
        echo "❌ cozy-release: Cherry pick failed. You must end the patch manually by merging all its change into master."
        exit 1
      fi
    fi
  done

  echo "☁️ cozy-release: Deleting patch branch $branch"
  git branch -D $branch

  if [[ ! $NO_PUSH ]]; then
    echo "☁️ cozy-release: Pushing master to $remote"
    git push $remote HEAD
    git push $remote :$branch
  fi

  echo "☁️ cozy-release: Patch ended successfully"
}

show_help() {
  echo "$(tput bold)usage:$(tput sgr0) cozy-release command arguments... [options]"
  echo "  $(tput bold)command:"
  echo ""
  echo "    $(tput bold)beta [remote]$(tput sgr0)      Creates a new beta tag in the current release"
  echo "                       branch or patch branch, and push this tag to"
  echo "                       \$remote repository."
  echo ""
  echo "    $(tput bold)patch version [remote]$(tput sgr0) Starts a new patch from the given \$version."
  echo "                       \$version must be a stable version and the"
  echo "                       related tag must exist."
  echo "                       are both pushed to \$remote repository. Default"
  echo "                       \$remote is origin."
  echo ""
  echo "    $(tput bold)release [remote]$(tput sgr0)   Starts a new release from the current version,"
  echo "                       tag it as beta and bump master to a new master"
  echo "                       minor version. Release branch and bump commit"
  echo "                       are both pushed to \$remote repository. Default"
  echo "                       \$remote is origin."
  echo ""
  echo "    $(tput bold)stable [remote]$(tput sgr0)    Creates a new stable tag in the current release"
  echo "                       branch or patch branch, and push this tag to"
  echo "                       \$remote repository. Once a stable version has"
  echo "                       been tagged, no new beta tag for this version"
  echo "                       can be made with cozy-release. Default"
  echo "                       \$remote is origin. cozy-release allows only one"
  echo "                       release branch at a time."
  echo "  $(tput bold)options:$(tput sgr0)"
  echo ""
  echo "    $(tput bold)--help$(tput sgr0)             Shows help."
  echo ""
  echo "    $(tput bold)--no-push$(tput sgr0)          Nothing is pushed to remote repository. Ideal"
  echo "                       for testing stuff."
  echo ""
  echo "$(tput bold)example:$(tput sgr0)"
  echo "  From master at version 1.0.0"
  echo "  \$> cozy-release start"
  echo "    -> Creates a new branch called release-1.0.0"
  echo "    -> Pushes it to origin"
  echo "    -> Tags a new 1.0.0-beta.1 version from this branch"
  echo "    -> Pushes it to origin"
  echo "    -> Updates the version in manifest.webapp and package.json file to "
  echo "       1.1.0"
  echo "    -> Commits this change and push it to origin"
  echo "  \$> cozy-release beta"
  echo "    -> Tags a new 1.0.0-beta.2 version from release-1.0.0"
  echo "    -> Pushes it to origin"
  echo "  \$> cozy-release stable"
  echo "    -> Tags a new 1.0.0 version from release-1.0.0"
  echo "    -> Pushes it to origin"
  echo "  \$> cozy-release patch 1.0.0"
  echo "    -> Creates a new branch called patch-1.0.1"
  echo "    -> Updates the version in manifest.webapp and package.json file to "
  echo "       1.0.1"
  echo "    -> Pushes the patch-1.0.1 branch to origin"
  echo "  \$> cozy-release beta"
  echo "    -> Tags a new 1.0.1-beta.1 version from branch patch-1.0.1"
  echo "    -> Pushes it to origin"
}

show_start_help() {
  echo "$(tput bold)usage:$(tput sgr0) cozy-release start [remote] [options]"
  echo ""
  echo "  Starts a new release by creating a new release branch and pushing it"
  echo "  to \$remote. Then tags a bew beta version and push it to \$remote."
  echo "  Eventually it bumps master to new minor version, commit it and guess"
  echo "  what? Yes! it pushes to \$remote."
  echo ""
  echo "  $(tput bold)remote:$(tput sgr0)       The remote repository, default is"
  echo "                 origin."
  echo ""
  echo "  $(tput bold)options:$(tput sgr0)"
  echo ""
  echo "    $(tput bold)--help$(tput sgr0)       Shows help."
  echo ""
  echo "    $(tput bold)--no-push$(tput sgr0)    Nothing is pushed to remote repository. Ideal"
  echo "                       for testing stuff."
  echo ""
  echo "$(tput bold)example:$(tput sgr0)"
  echo "  From master at version 1.0.0"
  echo "  \$> cozy-release start"
  echo "    -> Creates a new branch called release-1.0.0"
  echo "    -> Pushes it to origin"
  echo "    -> Tags a new 1.0.0-beta.1 version from this branch"
  echo "    -> Pushes it to origin"
  echo "    -> Updates the version in manifest.webapp and package.json file to "
  echo "       1.1.0"
  echo "    -> Commits this change and push it to origin"
}

show_beta_help() {
  echo "$(tput bold)usage:$(tput sgr0) cozy-release beta [remote] [options]"
  echo ""
  echo "  Tags a new beta version from the current release branch or the"
  echo "  current patch branch. And pushes it to \$remote."
  echo ""
  echo "  $(tput bold)remote:$(tput sgr0)       The remote repository, default is"
  echo "                 origin."
  echo ""
  echo "  $(tput bold)options:$(tput sgr0)"
  echo ""
  echo "    $(tput bold)--help$(tput sgr0)       Shows help."
  echo ""
  echo "    $(tput bold)--no-push$(tput sgr0)    Nothing is pushed to remote repository. Ideal"
  echo "                       for testing stuff."
  echo ""
  echo "$(tput bold)example:$(tput sgr0)"
  echo "  From branch release-1.0.0, tag 1.0.0-beta.1 already exists"
  echo "  \$> cozy-release beta"
  echo "    -> Tags a new 1.0.0-beta.2 version from release-1.0.0"
  echo "    -> Pushes it to origin"
}

show_stable_help() {
  echo "$(tput bold)usage:$(tput sgr0) cozy-release stable [remote] [options]"
  echo ""
  echo "  Tags a new stable version from the current release branch or the"
  echo "  current patch branch. And pushes it to \$remote."
  echo ""
  echo "  $(tput bold)remote:$(tput sgr0)       The remote repository, default is"
  echo "                 origin."
  echo ""
  echo "  $(tput bold)options:$(tput sgr0)"
  echo ""
  echo "    $(tput bold)--help$(tput sgr0)       Shows help."
  echo ""
  echo "    $(tput bold)--no-push$(tput sgr0)    Nothing is pushed to remote repository. Ideal"
  echo "                       for testing stuff."
  echo ""
  echo "$(tput bold)example:$(tput sgr0)"
  echo "  From branch release-1.0.0"
  echo "  \$> cozy-release stable"
  echo "    -> Tags a new 1.0.0 version from release-1.0.0"
  echo "    -> Pushes it to origin"
}

show_patch_help() {
  echo "$(tput bold)usage:$(tput sgr0) cozy-release patch version [remote] [options]"
  echo ""
  echo "  Starts a new patch by creating a new patch branch, bumping the"
  echo "  current version and push the new branch to \$remote."
  echo ""
  echo "  $(tput bold)remote:$(tput sgr0)       The remote repository, default is"
  echo "                origin."
  echo ""
  echo "  $(tput bold)version:$(tput sgr0)      The stable version to patch."
  echo ""
  echo "  $(tput bold)options:$(tput sgr0)"
  echo ""
  echo "    $(tput bold)--help$(tput sgr0)       Shows help."
  echo ""
  echo "    $(tput bold)--no-push$(tput sgr0)    Nothing is pushed to remote repository. Ideal"
  echo "                       for testing stuff."
  echo ""
  echo "$(tput bold)example:$(tput sgr0)"
  echo "  From master at version 1.1.0"
  echo "  \$> cozy-release patch 1.0.0"
  echo "    -> Creates a new branch called patch-1.0.1"
  echo "    -> Bumps version to 1.0.1 in this branch."
  echo "    -> Pushes the branch to origin"
}

show_end_help () {
  echo "$(tput bold)usage:$(tput sgr0) cozy-release end [remote] [options]"
  echo ""
  echo "  Ends a release or a patch by merging the branch into master and"
  echo "  deleting it. Pushes all changes to \$remote."
  echo ""
  echo "  $(tput bold)remote:$(tput sgr0)       The remote repository, default is"
  echo "                origin."
  echo ""
  echo "  $(tput bold)options:$(tput sgr0)"
  echo ""
  echo "    $(tput bold)--help$(tput sgr0)       Shows help."
  echo ""
  echo "    $(tput bold)--no-push$(tput sgr0)    Nothing is pushed to remote repository. Ideal"
  echo "                       for testing stuff."
  echo ""
  echo "$(tput bold)example:$(tput sgr0)"
  echo "  From branch release-1.1.0"
  echo "  \$> cozy-release end"
  echo "    -> Merges release-1.1.0 into master"
  echo "    -> Deletes release-1.1.0"
  echo "    -> Pushes the deletion to origin"
  echo "  From branch patch-1.1.1"
  echo "  \$> cozy-release end"
  echo "    -> Creates an branch merge-1.1.1 with all patch-1.1.1 commits expect the first one (which is a version bump commit)"
  echo "    -> Merges merge-1.1.1 into master"
  echo "    -> Deletes patch-1.1.1"
  echo "    -> Pushes the deletion to origin"
  echo "    -> Deletes merge-1.1.1"
}

if [[ ! -z "${UNKNOWN_OPTION// }" ]]; then
  echo "Unknown option $(tput bold)$UNKNOWN_OPTION$(tput sgr0). Run cozy-release --help to list available options."
  exit 1
fi

case "$command" in
  start ) start ${remote:-origin} ;;
  beta ) beta ${remote:-origin} ;;
  stable ) stable ${remote:-origin} ;;
  patch ) patch ${remote:-origin} $version;;
  end ) end ${remote:-origin} ;;
  *) show_help;;
esac
