# Duel

Inspired by https://github.com/knightedcodemonkey/duel but much simpler.

Use raw typescript to get dual ESM/CJS build, no bundler needed.

For this package to work, all imports must be CJS, ESM only imports will break the CJS build.

### How it works

1) Takes your ESM project and copies the whole thing to a temp dir.
2) Renames all your ts files cts file
3) runs typescript build again
4) copies the build back into the original directory



