/*jslint nomen: true*/
var features_ = {};

function activate(featureName) {
    features_[featureName] = true;

    return true;
}

function isActive(featureName) {
    if (features_.hasOwnProperty(featureName)) {
        return features_[featureName];
    }

    return false;
}

module.exports = {
    "activate": activate,
    "isActive": isActive
};