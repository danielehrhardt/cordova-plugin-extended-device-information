var argscheck = require('cordova/argscheck'),
channel = require('cordova/channel'),
utils = require('cordova/utils'),
exec = require('cordova/exec'),
cordova = require('cordova');

channel.createSticky('onCordovaInfoReady');
// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

/**
* This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
* phone, etc.
* @constructor
*/
function Device() {
this.memory = null;
this.cpumhz = null;

var me = this;

channel.onCordovaReady.subscribe(function() {
    me.getInfo(function(info) {
        //ignoring info.cordova returning from native, we should use value from cordova.version defined in cordova.js
        //TODO: CB-5105 native implementations should not return info.cordova
        var buildLabel = cordova.version;

        me.memory = info.memory || 'unknown';
        me.cpumhz = info.cpumhz || 'unknown';
        
        channel.onCordovaInfoReady.fire();
    },function(e) {
        me.available = false;
        utils.alert("[ERROR] Error initializing Cordova: " + e);
    });
});
}

/**
* Get device info
*
* @param {Function} successCallback The function to call when the heading data is available
* @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
*/
Device.prototype.getInfo = function(successCallback, errorCallback) {
argscheck.checkArgs('fF', 'Device.getExtendedInfo', arguments);
exec(successCallback, errorCallback, "Device", "getExtendedDeviceInfo", []);
};

module.exports = new Device();
