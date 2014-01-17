/*jslint nomen: true*/
var features_ = {},
    featureLoader = require('./lib/feature-loader');

function enable(featureName) {
    features_[featureName] = true;

    return true;
}

function disable(featureName) {
    if (features_.hasOwnProperty(featureName)) {
        delete features_[featureName];
        return true;
    }

    return false;
}

function isEnabled(featureName) {
    if (features_.hasOwnProperty(featureName)) {
        return features_[featureName];
    }

    return false;
}

function update(data, callback) {
    Object.keys(data).forEach(function (feature) {
        if (data.hasOwnProperty(feature)) {
            features_[feature] = data[feature];
        }
    });

    callback();
}

function load(filename, callback) {
    return featureLoader.load(filename, function (error, data) {
        update(data, callback);
    });
}

module.exports = {
    "enable": enable,
    "disable": disable,
    "isEnabled": isEnabled,
    "load": load
};