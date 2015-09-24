# Developer Notes

1. CI Systems

## 1. CI Systems

FlipIt currently utilizes two CI systems: Travis-CI & Wercker. Both systems are used for building against the master branch.

### Travis-CI

[Travis-CI](http://travis-ci.org) is primarily used for Pull Request builds and publishing to the NPM registry.

It's secondary use is to validate FlipIt's functionality for future NodeJS releases.

### Wercker

[Wercker](http://www.wercker.com) was recently introduced in order to understand build systems beyond Travis-CI.

Wercker is primarily used for updating the code coverage via Coveralls & Code Climate. Travis-CI used to perform this update, but it was difficult for others to contribute to FlipIt without the Coveralls API key.

## 2. Build Badges

<table>
  <thead>
    <tr>
      <th>Platform</th>
      <th>Badges</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://travis-ci.org">Travis CI</a></td>
      <td><a href="https://travis-ci.org/FenrirUnbound/flipit"><img alt="Travis-CI status" src="https://travis-ci.org/FenrirUnbound/flipit.svg?branch=master"></a></td>
    </tr>
    <tr>
      <td><a href="https://wercker.com">Wercker</a></td>
      <td><a href="https://app.wercker.com/project/bykey/640ac037ec438423b79226b1f689d8c3"><img alt="Wercker status" src="https://app.wercker.com/status/640ac037ec438423b79226b1f689d8c3/m"></a>  <br />  <a href="https://app.wercker.com/project/bykey/640ac037ec438423b79226b1f689d8c3"><img alt="Wercker status" src="https://app.wercker.com/status/640ac037ec438423b79226b1f689d8c3/s"></a>
      </td>
    </tr>
    <tr>
      <td><a href="https://coveralls.io">Coveralls</a></td>
      <td><a href='https://coveralls.io/github/FenrirUnbound/flipit?branch=master'><img src='https://coveralls.io/repos/FenrirUnbound/flipit/badge.svg?branch=master&service=github' alt='Coverage Status' /></a></td>
    </tr>
    <tr>
      <td><a href="https://codeclimate.com">Code Climate</a></td>
      <td><a href="https://codeclimate.com/github/FenrirUnbound/flipit"><img src="https://codeclimate.com/github/FenrirUnbound/flipit/badges/gpa.svg" /></a>  <br />  <a href="https://codeclimate.com/github/FenrirUnbound/flipit/coverage"><img src="https://codeclimate.com/github/FenrirUnbound/flipit/badges/coverage.svg" /></a> </td>
    </tr>
  </tbody>
</table>
