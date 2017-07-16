# for some environments "node" is lazily loaded,
# therefore it's preferred to source this file instead of executing it
# e.g. ". ./lint-all.sh"

# make sure it's properly loaded
node --version

find . -type f -name '*.es' \
  -not \( -path ./.git -o -path ./node_modules \) \
  -exec ./node_modules/eslint/bin/eslint.js {} +

echo 'Should not find any *.es files under ./test'
find ./test -name '*.es'
