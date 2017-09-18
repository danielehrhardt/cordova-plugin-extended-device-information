/**
 * This plugin defines a global device object, which describes the device's hardware and software.
 * Although the object is in the global scope, it is not available until after the deviceready event.
 */
interface ExtendedDeviceInformation {
    /** Get the device memory */
    memory: string;
    /** Get the cpu size */
    cpumhz:string;

}

declare var device: ExtendedDeviceInformation;