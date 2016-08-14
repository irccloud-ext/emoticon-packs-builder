git config --global push.default simple
git config --global user.name "CircleCI"
git config --global user.email circleci@users.noreply.github.com

[[ ! -z "$CIRCLE_BUILD_NUM" ]] && BUILD_SUFFIX=" #$CIRCLE_BUILD_NUM"
COMMIT_HEADER="CircleCI Build$BUILD_SUFFIX"
COMMIT_MSG="$(git log --format=%B -1)"
COMMIT_CONCAT=$(echo -e "$COMMIT_HEADER\n\n$COMMIT_MSG")

git clone -b gh-pages git@github.com:irccloud-ext/emoticon-packs.git gh-pages
cp -r build/* gh-pages/

echo -e "==============\nCOMMIT MESSAGE\n==============\n$COMMIT_CONCAT"

cd gh-pages
git add -A
git commit -m "$COMMIT_HEADER" -m "$COMMIT_MSG"
git push
