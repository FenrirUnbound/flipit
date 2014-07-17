[![Build Status](https://travis-ci.org/FenrirUnbound/flipit.png?branch=master)](https://travis-ci.org/FenrirUnbound/flipit) [![Coverage Status](https://coveralls.io/repos/FenrirUnbound/flipit/badge.png?branch=)](https://coveralls.io/r/FenrirUnbound/flipit?branch=)
[![wercker status](https://app.wercker.com/status/640ac037ec438423b79226b1f689d8c3/s/master "wercker status")](https://app.wercker.com/project/bykey/640ac037ec438423b79226b1f689d8c3)

# flipit

A module that allows you to use feature flags (also known as feature flipping) in Node.js.

You can enable/disable features programmatically or via an external configuration file. Any changes to the configuration file
will update the module without requiring a restart.

## Configuration File

Optionally, the flipit module can load a JSON file that contains the feature flags/switches, as well as their initial state.

```
{
    "testFeature": true,
    "anotherFeatureForTesting": true,
    "thisShouldBeUnavailable": false
}
```

## Example Usage

```
var flipit = require('flipit'),
	result;

flipit.load('testConfigurationFile.json');

result = flipit.isEnabled('testFeature');
console.log(result);    // true

result = flipit.isEnabled('thisShouldBeUnavailable');
console.log(result);    // false

flipit.disable('testFeature');
result = flipit.isEnabled('testFeature');
console.log(result);    // false

flipit.enable('thisShouldBeUnavailable');
result = flipit.isEnabled('thisShouldBeUnavailable');
console.log(result);    // true
```

## API

### load('filepathToJsonFile', [callback])

Loads a JSON file containing an object of key-value pairs.

* `'filepathToJsonFile'`: The absolute path to the JSON configuration file.
* `callback`: Optional. The flipit module will detect any updates made to the given JSON file. After the state of the feature flags/switches has been updated, the callback will be triggered.

Returns a `fs.FSWatcher` object. For reference: [Node.JS API](http://nodejs.org/api/fs.html#fs_class_fs_fswatcher) document.

### isEnabled('featureName')

Checks if a given feature `'featureName'` is enabled.

* `'featureName'`: The name of the feature flag/switch. If loaded from a JSON configuration file, this will be the name of the key.

Returns true or false, whether the feature flag/switch is (respectively) enabled or disabled.

### disable('featureName')

Disables a given feature `'featureName'`. Calling `flipit.disable()` with a feature that is already disabled is a no-op, not an error.

* `'featureName'`: The name of the feature flag/switch. If loaded from a JSON configuration file, this will be the name of the key.

Returns nothing.

### enable('featureName')

Enables a given feature `'featureName'`. Calling `flipit.enable()` with a feature that is already enabled is a no-op, not an error.

* `'featureName'`: The name of the feature flag/switch. If loaded from a JSON configuration file, this will be the name of the key.

Returns nothing.
