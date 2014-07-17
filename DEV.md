# Developer Notes

1. CI Systems

## 1. CI Systems

FlipIt currently utilizes two CI systems: Travis-CI & Wercker. Both systems are used for building against the master branch.

### Travis-CI

[Travis-CI](http://travis-ci.org) is primarily used for Pull Request builds and publishing to the NPM registry.

It's secondary use is to validate FlipIt's functionality for future NodeJS releases.

### Wercker

[Wercker](http://www.wercker.com) was recently introduced in order to understand build systems beyond Travis-CI.

Wercker is primarily used for updating the code coverage via Coveralls. Travis-CI used to perform this update, but it was difficult for others to contribute to FlipIt without the Coveralls API key.