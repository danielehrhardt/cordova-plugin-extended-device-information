var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');

channel.createSticky('onCordovaInformationReady');
channel.waitForInitialization('onCordovaInformationReady');

/**
 * This represents the mobile device, and provides properties for inspecting the model, version, UUID of the
 * phone, etc.
 * @constructor
 */
function ExtendedDevice() {
    this.memory = null;
    this.cpumhz = null;
    this.totalstorage = null;
    this.freestorage = null;

    var me = this;
    
    channel.onCordovaReady.subscribe(function () {
        if(cordova.platformId === 'android') {
            me.getInfo(function(info){
                console.log('Device Data', info);
                me.memory = info.memory || 'unknown';
                me.cpumhz = info.cpumhz || 'unknown';
                me.totalstorage = info.totalstorage || 'unknown';
                me.freestorage = info.freestorage || 'unknown';
                channel.onCordovaInformationReady.fire();
            }, function(e){
                utils.alert('[ERROR] Error initializing Cordova: ' + e);
            });
        } else {
            channel.onCordovaInformationReady.fire();
        }
    });
    
}

/**
 * Get device info
 *
 * @param {Function} successCallback The function to call when the heading data is available
 * @param {Function} errorCallback The function to call when there is an error getting the heading data. (OPTIONAL)
 */
ExtendedDevice.prototype.getInfo = function (successCallback, errorCallback) {
    argscheck.checkArgs('fF', 'ExtendedDevice.getInfo', arguments);
    exec(successCallback, errorCallback, "ExtendedDevice", "getExtendedDeviceInfo", []);
};

module.exports = new ExtendedDevice();