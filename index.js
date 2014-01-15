/*jslint nomen: true*/
var features_ = {};

function enable(featureName) {
    features_[featureName] = true;

    return true;
}

function disable(featureName) {
    if (features_.hasOwnProperty(featureName)) {
        delete features_[featureName];
    }

    return true;
}

function isEnabled(featureName) {
    if (features_.hasOwnProperty(featureName)) {
        return features_[featureName];
    }

    return false;
}

module.exports = {
    "enable": enable,
    "disable": disable,
    "isEnabled": isEnabled
};