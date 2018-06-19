/**
 * This plugin defines a global device object, which describes the device's hardware and software.
 * Although the object is in the global scope, it is not available until after the deviceready event.
 */
interface ExtendedDeviceInformation {
    
    /** Get the cpu size */
    cpumhz: number;

    /** Get the device memory */
    memory: string;

    /** Get the Total System Storage Size in MB */
    totalstorage: string;

    /** Get the Free System Storage Size in MB */
    freestorage: number;

}

declare var device: ExtendedDeviceInformation;