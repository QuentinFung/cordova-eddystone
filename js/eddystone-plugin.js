
// --------------------------------------------------


// File: evothings-base.js
//
// Set up definitions needed by Eddystone JavaScript library.
//

// Global holding everything.
window.evothings = window.evothings || {};

// Define an empty No Operation function. This function is called
// in place of async script loading, since we build a single merged file.
// See the build script buildEddystonePlauginJS.rb which is where
// async loading gets replaced by this function.
evothings.__NOOP_FUN__ = function() {};


// --------------------------------------------------


// File: util.js

evothings = window.evothings || {};

/**
 * @namespace
 * @author Aaron Ardiri
 * @author Fredrik Eldh
 * @description Utilities for byte arrays.
 */
evothings.util = {};

;(function()
{
	/**
	 * Interpret byte buffer as little endian 8 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToInt8 = function(data, offset)
	{
		var x = evothings.util.littleEndianToUint8(data, offset)
		if (x & 0x80) x = x - 256
		return x
	}

	/**
	 * Interpret byte buffer as unsigned little endian 8 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToUint8 = function(data, offset)
	{
		return data[offset]
	}

	/**
	 * Interpret byte buffer as little endian 16 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToInt16 = function(data, offset)
	{
		return (evothings.util.littleEndianToInt8(data, offset + 1) << 8) +
			evothings.util.littleEndianToUint8(data, offset)
	}

	/**
	 * Interpret byte buffer as unsigned little endian 16 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToUint16 = function(data, offset)
	{
		return (evothings.util.littleEndianToUint8(data, offset + 1) << 8) +
			evothings.util.littleEndianToUint8(data, offset)
	}

	/**
	 * Interpret byte buffer as unsigned little endian 32 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.littleEndianToUint32 = function(data, offset)
	{
		return (evothings.util.littleEndianToUint8(data, offset + 3) << 24) +
			(evothings.util.littleEndianToUint8(data, offset + 2) << 16) +
			(evothings.util.littleEndianToUint8(data, offset + 1) << 8) +
			evothings.util.littleEndianToUint8(data, offset)
	}


	/**
	 * Interpret byte buffer as signed big endian 16 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.bigEndianToInt16 = function(data, offset)
	{
		return (evothings.util.littleEndianToInt8(data, offset) << 8) +
			evothings.util.littleEndianToUint8(data, offset + 1)
	}

	/**
	 * Interpret byte buffer as unsigned big endian 16 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.bigEndianToUint16 = function(data, offset)
	{
		return (evothings.util.littleEndianToUint8(data, offset) << 8) +
			evothings.util.littleEndianToUint8(data, offset + 1)
	}

	/**
	 * Interpret byte buffer as unsigned big endian 32 bit integer.
	 * Returns converted number.
	 * @param {ArrayBuffer} data - Input buffer.
	 * @param {number} offset - Start of data.
	 * @return Converted number.
	 * @public
	 */
	evothings.util.bigEndianToUint32 = function(data, offset)
	{
		return (evothings.util.littleEndianToUint8(data, offset) << 24) +
			(evothings.util.littleEndianToUint8(data, offset + 1) << 16) +
			(evothings.util.littleEndianToUint8(data, offset + 2) << 8) +
			evothings.util.littleEndianToUint8(data, offset + 3)
	}

	/**
	 * Converts a single Base64 character to a 6-bit integer.
	 * @private
	 */
	function b64ToUint6(nChr) {
		return nChr > 64 && nChr < 91 ?
				nChr - 65
			: nChr > 96 && nChr < 123 ?
				nChr - 71
			: nChr > 47 && nChr < 58 ?
				nChr + 4
			: nChr === 43 ?
				62
			: nChr === 47 ?
				63
			:
				0;
	}

	/**
	 * Decodes a Base64 string. Returns a Uint8Array.
	 * nBlocksSize is optional.
	 * @param {String} sBase64
	 * @param {int} nBlocksSize
	 * @return {Uint8Array}
	 * @public
	 */
	evothings.util.base64DecToArr = function(sBase64, nBlocksSize) {
		var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
		var nInLen = sB64Enc.length;
		var nOutLen = nBlocksSize ?
			Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize
			: nInLen * 3 + 1 >> 2;
		var taBytes = new Uint8Array(nOutLen);

		for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
			nMod4 = nInIdx & 3;
			nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
			if (nMod4 === 3 || nInLen - nInIdx === 1) {
				for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
					taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
				}
				nUint24 = 0;
			}
		}

		return taBytes;
	}

	/**
	 * Returns the integer i in hexadecimal string form,
	 * with leading zeroes, such that
	 * the resulting string is at least byteCount*2 characters long.
	 * @param {int} i
	 * @param {int} byteCount
	 * @public
	 */
	evothings.util.toHexString = function(i, byteCount) {
		var string = (new Number(i)).toString(16);
		while(string.length < byteCount*2) {
			string = '0'+string;
		}
		return string;
	}

	/**
	 * Takes a ArrayBuffer or TypedArray and returns its hexadecimal representation.
	 * No spaces or linebreaks.
	 * @param data
	 * @public
	 */
	evothings.util.typedArrayToHexString = function(data) {
		// view data as a Uint8Array, unless it already is one.
		if(data.buffer) {
			if(!(data instanceof Uint8Array))
				data = new Uint8Array(data.buffer);
		} else if(data instanceof ArrayBuffer) {
			data = new Uint8Array(data);
		} else {
			throw "not an ArrayBuffer or TypedArray.";
		}
		var str = '';
		for(var i=0; i<data.length; i++) {
			str += evothings.util.toHexString(data[i], 1);
		}
		return str;
	}

	const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	const base64Variants = {
	  base64: {
		label: 'Standard \'base64\' (RFC 3548, RFC 4648)',
		description: null,
		alphabet: base64Alphabet + '+/',
		padCharacter: '=',
		padCharacterOptional: false,
		foreignCharactersForbidden: true
	  }
	}

	function chunk (string, length) {
		return string !== '' ? string.match(new RegExp(`.{1,${length}}`, 'g')) : [];
	}

	function binaryToHex(s) {
		var i, k, part, accum, ret = '';
		for (i = s.length-1; i >= 3; i -= 4) {
			// extract out in substrings of 4 and convert to hex
			part = s.substr(i+1-4, 4);
			accum = 0;
			for (k = 0; k < 4; k += 1) {
				if (part[k] !== '0' && part[k] !== '1') {
					// invalid character
					return -1;
				}
				// compute the length 4 substring
				accum = accum * 2 + parseInt(part[k], 10);
			}
			if (accum >= 10) {
				// 'A' to 'F'
				ret = String.fromCharCode(accum - 10 + 'A'.charCodeAt(0)) + ret;
			} else {
				// '0' to '9'
				ret = String(accum) + ret;
			}
		}
		// remaining characters, i = 0, 1, or 2
		if (i >= 0) {
			accum = 0;
			// convert from front
			for (k = 0; k <= i; k += 1) {
				if (s[k] !== '0' && s[k] !== '1') {
					return { valid: false };
				}
				accum = accum * 2 + parseInt(s[k], 10);
			}
			// 3 bits, value cannot exceed 2^3 - 1 = 7, just convert
			ret = String(accum) + ret;
		}
		return ret ;
	}

	function bytesFromBinaryString (string) {
		// fill up leading zero digits
		if (string.length % 8 > 0) {
		  string = ('0000000' + string).substr(string.length % 8 - 1)
		}

		// decode each byte
		var bytes = chunk(string, 8).map(function (byteString, index) {
		  var byte = parseInt(byteString, 2)
		  return byte
		})

		return new Uint8Array(bytes)
	  }

	function base64StringFromBytes (bytes, variant) {
		if (variant == null || variant == undefined) {
			variant = 'base64'
		}
		var options = base64Variants[variant]
		var alphabet = options.alphabet
		var padCharacter = !options.padCharacterOptional && options.padCharacter ? options.padCharacter : ''

		// encode each 3-byte-pair
		var string = ''
		var byte1, byte2, byte3
		var octet1, octet2, octet3, octet4

		for (var i = 0; i < bytes.length; i += 3) {
		  // collect pair bytes
		  byte1 = bytes[i]
		  byte2 = i + 1 < bytes.length ? bytes[i + 1] : NaN
		  byte3 = i + 2 < bytes.length ? bytes[i + 2] : NaN

		  // bits 1-6 from byte 1
		  octet1 = byte1 >> 2

		  // bits 7-8 from byte 1 joined by bits 1-4 from byte 2
		  octet2 = ((byte1 & 3) << 4) | (byte2 >> 4)

		  // bits 4-8 from byte 2 joined by bits 1-2 from byte 3
		  octet3 = ((byte2 & 15) << 2) | (byte3 >> 6)

		  // bits 3-8 from byte 3
		  octet4 = byte3 & 63

		  // map octets to characters
		  string +=
			alphabet[octet1] +
			alphabet[octet2] +
			(!isNaN(byte2) ? alphabet[octet3] : padCharacter) +
			(!isNaN(byte3) ? alphabet[octet4] : padCharacter)
		}

		if (options.maxLineLength) {
		  // limit text line length, insert line separators
		  var limitedString = ''
		  for (var i = 0; i < string.length; i += options.maxLineLength) {
			limitedString +=
			  (limitedString !== '' ? options.lineSeparator : '') +
			  string.substr(i, options.maxLineLength)
		  }
		  string = limitedString
		}

		return string
	  }

	function decToBinary(s) {
		//console.log("decToBinary: " + s + " -> " + Number(s).toString(2).padStart(8, '0'));
		// return Number(s).toString(2).padStart(8, '0'); // not working for iOS 9
		return ('00000000' + Number(s).toString(2)).slice(-8);
	}

	function decArrToBinary(arr) {
		var bin = "";
		for(i =0;i<arr.length;i++) {
			bin += decToBinary(arr[i]);
		}
		return bin;
	}

	evothings.util.decArrToHex = function decArrToHex(arr) {
		//console.log("Dec: " + JSON.stringify(arr));
		//console.log("Bin: " + JSON.stringify(arr.map(decToBinary)));
		var hex = "";
		for(i =0;i<arr.length;i++) {
			hex += binaryToHex(decToBinary(arr[i]));
		}
		//console.log("Hex: " + JSON.stringify(arr.map(decToBinary).map(binaryToHex)));
		return hex;
	}

	evothings.util.decArrToBase64 = function decArrToBase64(arr) {
		return base64StringFromBytes(bytesFromBinaryString(decArrToBinary(arr)));
	}
})();


// --------------------------------------------------


// File: easyble.js updated 160713

;(function()
{
	// Load script used by this file.
	evothings.__NOOP_FUN__('libs/evothings/util/util.js');

	/**
	 * @namespace
	 * @description <p>Library for making BLE programming easier.</p>
	 * <p>An all-in-one file with this library and helper libraries included is
	 * available in file <a href=""https://github.com/evothings/evothings-libraries/blob/master/libs/evothings/easyble/easyble.dist.js>easyble.dist.js</a>. Include this file in index.html (recommended).</p>
	 * <p>If you include <code>easyble.js</code> rather than <code>easyble.dist.js</code> it is safe practise to call function {@link evothings.scriptsLoaded}
	 * to ensure dependent libraries are loaded before calling functions
	 * in this library (in this case you also need to have the dependent library folders).</p>
	 */
	evothings.easyble = {};

	/**
	 * @namespace
	 * @description Error string.
	 */
	evothings.easyble.error = {};

	/**
	 * @description BLE device already connected.
	 */
	evothings.easyble.error.DEVICE_ALREADY_CONNECTED = 'EASYBLE_ERROR_DEVICE_ALREADY_CONNECTED';

	/**
	 * @description BLE device was disconnected.
	 */
	evothings.easyble.error.DISCONNECTED = 'EASYBLE_ERROR_DISCONNECTED';

	/**
	 * @description BLE service was not found.
	 */
	evothings.easyble.error.SERVICE_NOT_FOUND = 'EASYBLE_ERROR_SERVICE_NOT_FOUND';

	/**
	 * @description BLE characteristic was not found.
	 */
	evothings.easyble.error.CHARACTERISTIC_NOT_FOUND = 'EASYBLE_ERROR_CHARACTERISTIC_NOT_FOUND';

	/**
	 * @description BLE descriptor was not found.
	 */
	evothings.easyble.error.DESCRIPTOR_NOT_FOUND = 'EASYBLE_ERROR_DESCRIPTOR_NOT_FOUND';

	/**
	 * @private
	 * This variable is set "lazily", because when this script is loaded
	 * the Base64 Cordova module may not be loaded yet.
	 */
	var base64;

	/**
	 * Set to true to report found devices only once,
	 * set to false to report continuously.
	 * @private
	 */
	var reportDeviceOnce = false;

	/**
	 * @private
	 */
	var serviceFilter = false;

	/**
	 * @private
	 */
	var isScanning = false;

	/**
	 * Internal properties and functions.
	 * @private
	 */
	var internal = {};

	/**
	 * Internal variable used to track reading of service data.
	 * @private
	 */
	var readCounter = 0;

	/**
	 * Table of discovered devices.
	 * @private
	 */
	internal.knownDevices = {};

	/**
	 * Table of connected devices.
	 * @private
	 */
	internal.connectedDevices = {};

	/**
	 * @description <strong>Deprecated.</strong> Set whether to report devices once or continuously during scan.
	 * The default is to report continously.
	 * @deprecated Use the options parameter {@link evothings.easyble.ScanOptions} in
	 * function {@link evothings.easyble.startScan}.
	 * @param {boolean} reportOnce - Set to true to report found devices only once.
	 * Set to false to report continuously.
	 * @public
	 */
	evothings.easyble.reportDeviceOnce = function(reportOnce)
	{
		reportDeviceOnce = reportOnce;
	};

	/**
	 * @description Set to an Array of UUID strings to enable filtering of devices
	 * found by startScan().
	 * @param services - Array of UUID strings. Set to false to disable filtering.
	 * The default is no filtering. An empty array will cause no devices to be reported.
	 * @public
	 */
	evothings.easyble.filterDevicesByService = function(services)
	{
		serviceFilter = services;
	};

	/**
	 * @description Called during scanning when a BLE device is found.
	 * @callback evothings.easyble.scanCallback
	 * @param {evothings.easyble.EasyBLEDevice} device - EasyBLE device object
	 * found during scanning.
	 */

	/**
	 * @description This callback indicates that an operation was successful,
	 * without specifying and additional information.
	 * @callback evothings.easyble.emptyCallback - Callback that takes no parameters.
	 */

	/**
	 * @description This function is called when an operation fails.
	 * @callback evothings.easyble.failCallback
	 * @param {string} errorString - A human-readable string that
	 * describes the error that occurred.
	 */

	/**
	 * @description Called when successfully connected to a device.
	 * @callback evothings.easyble.connectCallback
	 * @param {evothings.easyble.EasyBLEDevice} device - EasyBLE devices object.
	 */

	/**
	 * @description Called when services are successfully read.
	 * @callback evothings.easyble.servicesCallback
	 * @param {evothings.easyble.EasyBLEDevice} device - EasyBLE devices object.
	 */

	/**
	 * @description Function when data is available.
	 * @callback evothings.easyble.dataCallback
	 * @param {ArrayBuffer} data - The data is an array buffer.
	 * Use an ArrayBufferView to access the data.
	 */

	/**
	 * @description Called with RSSI value.
	 * @callback evothings.easyble.rssiCallback
	 * @param {number} rssi - A negative integer, the signal strength in decibels.
	 * This value may be 127 which indicates an unknown value.
	 */

	/**
	 * @typedef {Object} evothings.easyble.ScanOptions
	 * @description Options for function {evothings.easyble.startScan}
	 * @property {array} serviceUUIDs - Array with strings of service UUIDs
	 * to scan for. When providing one service UUID, behaviour is the same on
	 * Android and iOS, when providing multiple UUIDs behaviour differs between
	 * platforms.
	 * On iOS multiple UUIDs are scanned for using logical OR operator,
	 * any UUID that matches any of the UUIDs adverticed by the device
	 * will count as a match. On Android, multiple UUIDs are scanned for
	 * using AND logic, the device must advertise all of the given UUIDs
	 * to produce a match. Leaving out this parameter or setting it to null
	 * will scan for all devices regardless of advertised services (default
	 * behaviour).
	 * @property {boolean} allowDuplicates - If true same device will be reported
	 * repeatedly during scanning, if false it will only be reported once.
	 * Default is true.
	 */

	/**
	 * Start scanning for devices. Note that the optional parameter serviceUUIDs
	 * has been deprecated. Please use the options parmameter
	 * {@link evothings.easyble.ScanOptions} instead to specify any specific
	 * service UUID to scan for.
	 * @param {evothings.easyble.scanCallback} success - Success function called when a
	 * device is found.
	 * Format: success({@link evothings.easyble.EasyBLEDevice}).
	 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
	 * @param {evothings.easyble.ScanOptions} [options] - Object with scan options.
	 * @public
	 * @example
	 *   // Scan for all services.
	 *   evothings.easyble.startScan(
	 *       function(device)
	 *       {
	 *           console.log('Found device named: ' + device.name);
	 *       },
	 *       function(errorCode)
	 *       {
	 *           console.log('startScan error: ' + errorCode);
	 *       }
	 *   );
	 *
	 *   // Scan for specific service.
	 *   evothings.easyble.startScan(
	 *       function(device)
	 *       {
	 *           console.log('Found device named: ' + device.name);
	 *       },
	 *       function(errorCode)
	 *       {
	 *           console.log('startScan error: ' + errorCode);
	 *       },
	 *       // Eddystone service UUID specified in options.
	 *       { serviceUUIDs: ['0000FEAA-0000-1000-8000-00805F9B34FB'] }
	 *   );
	 */
	evothings.easyble.startScan = function(arg1, arg2, arg3, arg4)
	{
		// Stop ongoing scan.
		evothings.easyble.stopScan();

		// Clear list of found devices.
		internal.knownDevices = {};

		// Scanning parameters.
		var serviceUUIDs;
		var success;
		var fail;
		var options;
		var allowDuplicates = undefined;

		// Determine parameters.
		if (Array.isArray(arg1))
		{
			// First param is an array of serviceUUIDs.
			serviceUUIDs = arg1;
			success = arg2;
			fail = arg3;
			options = arg4;
		}
		else if ('function' == typeof arg1)
		{
			// First param is a function.
			serviceUUIDs = null;
			success = arg1;
			fail = arg2;
			options = arg3;
		}

		// Set options.
		if (options)
		{
			if (Array.isArray(options.serviceUUIDs))
			{
				serviceUUIDs = options.serviceUUIDs;
			}

			if (options.allowDuplicates === true)
			{
				allowDuplicates = true;
			}
			else if (options.allowDuplicates === false)
			{
				allowDuplicates = false;
			}
		}

		// Start scanning.
		isScanning = true;
		if (Array.isArray(serviceUUIDs))
		{
			evothings.ble.startScan(serviceUUIDs, onDeviceFound, onError);
		}
		else
		{
			evothings.ble.startScan(onDeviceFound, onError);
		}

		function onDeviceFound(device)
		{
			// Don't report devices unless the isScanning flag is true.
			// This is to prevent devices being reported after stopScanning
			// has been called (this can happen since scanning does not stop
			// instantly when evothings.ble.stopScan is called).
			if (!isScanning) return;

			// Ensure we have advertisementData.
			internal.ensureAdvertisementData(device);

			// Check if the device matches the filter, if we have a filter.
			if (!internal.deviceMatchesServiceFilter(device))
			{
				return;
			}

			// Check if we already have got the device.
			var existingDevice = internal.knownDevices[device.address]
			if (existingDevice)
			{
				// Do not report device again if flag is set.
				if (allowDuplicates === false || reportDeviceOnce === true) { return; }

				// Duplicates allowed, report device again.
				existingDevice.rssi = device.rssi;
				existingDevice.name = device.name;
				existingDevice.scanRecord = device.scanRecord;
				existingDevice.advertisementData = device.advertisementData;
				success(existingDevice);

				return;
			}

			// New device, add to known devices.
			internal.knownDevices[device.address] = device;

			// Set connect status.
			device.__isConnected = false;

			// Add methods to the device info object.
			internal.addMethodsToDeviceObject(device);

			// Call callback function with device info.
			success(device);
		}

		function onError(errorCode)
		{
			fail(errorCode);
		}
	};

	/**
	 * Stop scanning for devices.
	 * @example
	 *   evothings.easyble.stopScan();
	 */
	evothings.easyble.stopScan = function()
	{
		isScanning = false;
		evothings.ble.stopScan();
	};

	/**
	 * Disconnect and close all connected BLE devices.
	 * @example
	 *   evothings.easyble.closeConnectedDevices();
	 */
	evothings.easyble.closeConnectedDevices = function()
	{
		for (var key in internal.connectedDevices)
		{
			var device = internal.connectedDevices[key];
			device && device.close();
			internal.connectedDevices[key] = null;
		}
	};

	/**
	 * If device already has advertisementData, does nothing.
	 * If device instead has scanRecord, creates advertisementData.
	 * See ble.js for AdvertisementData reference.
	 * @param device - Device object.
	 * @private
	 */
	internal.ensureAdvertisementData = function(device)
	{
		if (!base64) { base64 = cordova.require('cordova/base64'); }

		// If device object already has advertisementData we
		// do not need to parse the scanRecord.
		if (device.advertisementData) { return; }

		// Must have scanRecord yo continue.
		if (!device.scanRecord) { return; }

		// Here we parse BLE/GAP Scan Response Data.
		// See the Bluetooth Specification, v4.0, Volume 3, Part C, Section 11,
		// for details.

		var byteArray = evothings.util.base64DecToArr(device.scanRecord);
		var pos = 0;
		var advertisementData = {};
		var serviceUUIDs;
		var serviceData;

		// The scan record is a list of structures.
		// Each structure has a length byte, a type byte, and (length-1) data bytes.
		// The format of the data bytes depends on the type.
		// Malformed scanRecords will likely cause an exception in this function.
		while (pos < byteArray.length)
		{
			var length = byteArray[pos++];
			if (length == 0)
			{
				break;
			}
			length -= 1;
			var type = byteArray[pos++];

			// Parse types we know and care about.
			// Skip other types.

			var BLUETOOTH_BASE_UUID = '-0000-1000-8000-00805f9b34fb'

			// Convert 16-byte Uint8Array to RFC-4122-formatted UUID.
			function arrayToUUID(array, offset)
			{
				var k=0;
				var string = '';
				var UUID_format = [4, 2, 2, 2, 6];
				for (var l=0; l<UUID_format.length; l++)
				{
					if (l != 0)
					{
						string += '-';
					}
					for (var j=0; j<UUID_format[l]; j++, k++)
					{
						string += evothings.util.toHexString(array[offset+k], 1);
					}
				}
				return string;
			}

			if (type == 0x02 || type == 0x03) // 16-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for(var i=0; i<length; i+=2)
				{
					serviceUUIDs.push(
						'0000' +
						evothings.util.toHexString(
							evothings.util.littleEndianToUint16(byteArray, pos + i),
							2) +
						BLUETOOTH_BASE_UUID);
				}
			}
			if (type == 0x04 || type == 0x05) // 32-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for (var i=0; i<length; i+=4)
				{
					serviceUUIDs.push(
						evothings.util.toHexString(
							evothings.util.littleEndianToUint32(byteArray, pos + i),
							4) +
						BLUETOOTH_BASE_UUID);
				}
			}
			if (type == 0x06 || type == 0x07) // 128-bit Service Class UUIDs.
			{
				serviceUUIDs = serviceUUIDs ? serviceUUIDs : [];
				for (var i=0; i<length; i+=16)
				{
					serviceUUIDs.push(arrayToUUID(byteArray, pos + i));
				}
			}
			if (type == 0x08 || type == 0x09) // Local Name.
			{
				advertisementData.kCBAdvDataLocalName = evothings.ble.fromUtf8(
					new Uint8Array(byteArray.buffer, pos, length));
			}
			if (type == 0x0a) // TX Power Level.
			{
				advertisementData.kCBAdvDataTxPowerLevel =
					evothings.util.littleEndianToInt8(byteArray, pos);
			}
			if (type == 0x16) // Service Data, 16-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid =
					'0000' +
					evothings.util.toHexString(
						evothings.util.littleEndianToUint16(byteArray, pos),
						2) +
					BLUETOOTH_BASE_UUID;
				var data = new Uint8Array(byteArray.buffer, pos+2, length-2);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0x20) // Service Data, 32-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid =
					evothings.util.toHexString(
						evothings.util.littleEndianToUint32(byteArray, pos),
						4) +
					BLUETOOTH_BASE_UUID;
				var data = new Uint8Array(byteArray.buffer, pos+4, length-4);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0x21) // Service Data, 128-bit UUID.
			{
				serviceData = serviceData ? serviceData : {};
				var uuid = arrayToUUID(byteArray, pos);
				var data = new Uint8Array(byteArray.buffer, pos+16, length-16);
				serviceData[uuid] = base64.fromArrayBuffer(data);
			}
			if (type == 0xff) // Manufacturer-specific Data.
			{
				// Annoying to have to transform base64 back and forth,
				// but it has to be done in order to maintain the API.
				advertisementData.kCBAdvDataManufacturerData =
					base64.fromArrayBuffer(new Uint8Array(byteArray.buffer, pos, length));
			}

			pos += length;
		}
		advertisementData.kCBAdvDataServiceUUIDs = serviceUUIDs;
		advertisementData.kCBAdvDataServiceData = serviceData;
		device.advertisementData = advertisementData;

		/*
		// Log raw data for debugging purposes.

		console.log("scanRecord: "+evothings.util.typedArrayToHexString(byteArray));

		console.log(JSON.stringify(advertisementData));
		*/
	}

	/**
	 * Returns true if the device matches the serviceFilter, or if there is no filter.
	 * Returns false otherwise.
	 * @private
	 */
	internal.deviceMatchesServiceFilter = function(device)
	{
		if (!serviceFilter) { return true; }

		var advertisementData = device.advertisementData;
		if (advertisementData)
		{
			var serviceUUIDs = advertisementData.kCBAdvDataServiceUUIDs;
			if (serviceUUIDs)
			{
				for (var i in serviceUUIDs)
				{
					for (var j in serviceFilter)
					{
						if (serviceUUIDs[i].toLowerCase() ==
							serviceFilter[j].toLowerCase())
						{
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	/**
	 * Add functions to the device object to allow calling them
	 * in an object-oriented style.
	 * @private
	 */
	internal.addMethodsToDeviceObject = function(deviceObject)
	{
		/**
		 * @namespace
		 * @alias evothings.easyble.EasyBLEDevice
		 * @description This is the BLE DeviceInfo object obtained from the
		 * underlying Cordova plugin.
		 * @property {string} address - Uniquely identifies the device.
		 * The form of the address depends on the host platform.
		 * @property {number} rssi - A negative integer, the signal strength in decibels.
		 * @property {string} name - The device's name, or nil.
		 * @property {string} scanRecord - Base64-encoded binary data. Its meaning is
		 * device-specific. Not available on iOS.
		 * @property {evothings.easyble.AdvertisementData} advertisementData -
		 * Object containing some of the data from the scanRecord.
		 */
		var device = deviceObject;

		/**
		 * @typedef {Object} evothings.easyble.AdvertisementData
		 * @description Information extracted from a scanRecord. Some or all of the fields may be
		 * undefined. This varies between BLE devices.
		 * Depending on OS version and BLE device, additional fields, not documented
		 * here, may be present.
		 * @property {string} kCBAdvDataLocalName - The device's name. Use this field
		 * rather than device.name, since on iOS the device name is cached and changes
		 * are not reflected in device.name.
		 * @property {number} kCBAdvDataTxPowerLevel - Transmission power level as
		 * advertised by the device.
		 * @property {boolean} kCBAdvDataIsConnectable - True if the device accepts
		 * connections. False if it doesn't.
		 * @property {array} kCBAdvDataServiceUUIDs - Array of strings, the UUIDs of
		 * services advertised by the device. Formatted according to RFC 4122,
		 * all lowercase.
		 * @property {object} kCBAdvDataServiceData - Dictionary of strings to strings.
		 * The keys are service UUIDs. The values are base-64-encoded binary data.
		 * @property {string} kCBAdvDataManufacturerData - Base-64-encoded binary data.
		 * This field is used by BLE devices to advertise custom data that don't fit
		 * into any of the other fields.
		 */

		/**
		 * Get device name. If there is a device name present in
		 * advertisement data, this is returned. Otherwise the value of
		 * the device.name field is returned. Note that iOS caches the
		 * device.name field, but not the name in advertisement data.
		 * If you change name of the device, it is more reliable to use
		 * the field in advertisement data (this name is set in the device
		 * firmware code).
		 * @return Name of the device.
		 * @public
		 * @instance
		 * @example
		 *   var name = device.getName();
		 */
		device.getName = function()
		{
			// If there is a device name present in advertisement data,
			// check if this matches. (This name is not cached by iOS.)
			var deviceName = device.advertisementData ?
				device.advertisementData.kCBAdvDataLocalName : false;
			if (deviceName)
			{
				return deviceName;
			}
			else
			{
				return device.name;
			}
		};

		/**
		 * Match device name. First checks the device name present in
		 * advertisement data, if not present checks device.name field.
		 * @param name The name to match.
		 * @return true if device has the given name, false if not.
		 * @public
		 * @instance
		 * @example
		 *   device.hasName('MyBLEDevice');
		 */
		device.hasName = function(name)
		{
			// If there is a device name present in advertisement data,
			// check if this matches. (This name is not cached by iOS.)
			var deviceName = device.advertisementData ?
				device.advertisementData.kCBAdvDataLocalName : false;
			if (deviceName)
			{
				// TODO: This should be a comparison, but there has been
				// instances of the kCBAdvDataLocalName field ending with
				// a non-printable character, using indexOf is a quick
				// fix for this.
				return 0 == deviceName.indexOf(name);
			}

			// Otherwise check if device.name matches (cached by iOS,
			// might not match if device name is updated).
			return name == device.name;
		};

		/**
		 * Connect to the device.
		 * @param {evothings.easyble.connectCallback} success -
		 * Called when connected: success(device).
		 * @param {evothings.easyble.failCallback} fail -
		 * Called on error and if a disconnect happens.
		 * Format: error(errorMessage)
		 * @public
		 * @instance
		 * @example
		 *   device.connect(
		 *     function(device)
		 *     {
		 *       console.log('device connected.');
		 *       // Read services here.
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('connect error: ' + errorCode);
		 *     });
		 */
		device.connect = function(success, fail)
		{
			internal.connectToDevice(device, success, fail);
		};

		/**
		 * Check if device is connected.
		 * @return true if connected, false if not connected.
		 * @public
		 * @instance
		 * @example
		 *   var connected = device.isConnected();
		 */
		device.isConnected = function()
		{
			return device.__isConnected;
		};

		/**
		 * Close the device. This disconnects from the BLE device.
		 * @public
		 * @instance
		 * @example
		 * device.close();
		 */
		device.close = function()
		{
			if (device.deviceHandle)
			{
				device.__isConnected = false;
				evothings.ble.close(device.deviceHandle);
			}
		};

		/**
		 * Read devices RSSI. Device must be connected.
		 * @param {evothings.easyble.rssiCallback} success - Callback called with
		 * RSSI value: success(rssi).
		 * @param {evothings.easyble.failCallback} fail - Called on error: fail(error).
		 * @public
		 * @instance
		 */
		device.readRSSI = function(success, fail)
		{
			evothings.ble.rssi(device.deviceHandle, success, fail);
		};

		/**
		 * @typedef {Object} evothings.easyble.ReadServicesOptions
		 * @description Options object for function
		 * {@link evothings.easyble.EasyBLEDevice#readServices}
		 * @property {array} serviceUUIDs - Array of service UUID strings.
		 */

		/**
		 * Read services, characteristics and descriptors for the
		 * specified service UUIDs.
		 * <strong>Services must be read be able to access characteristics and
		 * descriptors</strong>. Call this function before reading and writing
		 * characteristics/descriptors. (This function took an array of service
		 * UUIDs as first parameter in previous versions of this library, that
		 * is still supported for backwards compatibility but has ben deprecated.)
		 * @param {evothings.easyble.servicesCallback} success -
		 * Called when services are read: success(device)
		 * @param {evothings.easyble.failCallback} fail - error callback:
		 * error(errorMessage)
		 * @param {evothings.easyble.ReadServicesOptions} [options] - Optional
		 * object with setting that allow specification of which services to
		 * read. If left out, all services and related characteristics and
		 * descriptors are read (this can be time-consuming compared to
		 * reading selected services).
		 * @public
		 * @instance
		 * @example
		 *   // Read all services
		 *   device.readServices(
		 *     function(device)
		 *     {
		 *       console.log('Services available.');
		 *       // Read/write/enable notifications here.
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('readServices error: ' + errorCode);
		 *     });
		 *
		 *   // Read specific service
		 *   device.readServices(
		 *     function(device)
		 *     {
		 *       console.log('Services available.');
		 *       // Read/write/enable notifications here.
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('readServices error: ' + errorCode);
		 *     },
		 *     { serviceUUIDs: ['19b10000-e8f2-537e-4f6c-d104768a1214'] });
		 */
		device.readServices = function(arg1, arg2, arg3, arg4)
		{
			// Parameters.
			var serviceUUIDs;
			var success;
			var fail;
			var options;

			// For backwards compatibility when first arg specified
			// an array of service UUIDs.
			if (Array.isArray(arg1))
			{
				serviceUUIDs = arg1;
				success = arg2;
				fail = arg3;
				options = arg4;
			}
			// Previously you could set first param to null to read all services.
			// Here we handle this case for backwards compatibility.
			else if (arg1 === undefined || arg1 === null)
			{
				serviceUUIDs = null;
				success = arg2;
				fail = arg3;
				options = arg4;
			}
			else
			{
				success = arg1;
				fail = arg2;
				options = arg3;
			}

			if (options && Array.isArray(options.serviceUUIDs))
			{
				serviceUUIDs = options.serviceUUIDs;
			}

			internal.readServices(device, serviceUUIDs, success, fail);
		};

		/**
		 * Read value of characteristic.
		 * @param {string} serviceUUID - UUID of service that has the given
		 * characteristic (previous versions of this library allowed leaving out
		 * the service UUID, this is unsafe practice and has been deprecated, always
		 * specify the service UUID).
		 * @param {string} characteristicUUID - UUID of characteristic to read.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.readCharacteristic(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     function(data)
		 *     {
		 *       console.log('characteristic data: ' + evothings.ble.fromUtf8(data));
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('readCharacteristic error: ' + errorCode);
		 *     });
		 */
		device.readCharacteristic = function(arg1, arg2, arg3, arg4)
		{
			if ('function' == typeof arg2)
			{
				// Service UUID is missing.
				internal.readCharacteristic(device, arg1, arg2, arg3);
			}
			else
			{
				// Service UUID is present.
				internal.readServiceCharacteristic(device, arg1, arg2, arg3, arg4);
			}
		};

		/**
		 * <strong>Deprecated</strong>.
		 * Use function {@link evothings.easyble.EasyBLEDevice#readCharacteristic}
		 * @deprecated
		 * @instance
		 */
		device.readServiceCharacteristic = function(
			serviceUUID, characteristicUUID, success, fail)
		{
			internal.readServiceCharacteristic(
				device, serviceUUID, characteristicUUID, success, fail);
		};

		/**
		 * Read value of descriptor.
		 * @param {string} serviceUUID - UUID of service that has the given
		 * characteristic (previous versions of this library allowed leaving out
		 * the service UUID, this is unsafe practice and has been deprecated, always
		 * specify the service UUID).
		 * @param {string} characteristicUUID - UUID of characteristic for descriptor.
		 * @param {string} descriptorUUID - UUID of descriptor to read.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.readDescriptor(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     descriptorUUID,
		 *     function(data)
		 *     {
		 *       console.log('descriptor data: ' + evothings.ble.fromUtf8(data));
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('readDescriptor error: ' + errorCode);
		 *     });
		 */
		device.readDescriptor = function(arg1, arg2, arg3, arg4, arg5)
		{
			if ('function' == typeof arg3)
			{
				// Service UUID is missing.
				internal.readDescriptor(device, arg1, arg2, arg3, arg4);
			}
			else
			{
				// Service UUID is present.
				internal.readServiceDescriptor(device, arg1, arg2, arg3, arg4, arg5);
			}
		};

		/**
		 * <strong>Deprecated</strong>.
		 * Use function {@link evothings.easyble.EasyBLEDevice#readDescriptor}
		 * @deprecated
		 * @instance
		 */
		device.readServiceDescriptor = function(
			serviceUUID, characteristicUUID, descriptorUUID, success, fail)
		{
			internal.readServiceDescriptor(
				device, serviceUUID, characteristicUUID, descriptorUUID, success, fail);
		};

		/**
		 * Write value of characteristic.
		 * @param {string} serviceUUID - UUID of service that has the given
		 * characteristic (previous versions of this library allowed leaving out
		 * the service UUID, this is unsafe practice and has been deprecated, always
		 * specify the service UUID).
		 * @param {string} characteristicUUID - UUID of characteristic to write to.
		 * @param {ArrayBufferView} value - Value to write.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success().
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.writeCharacteristic(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     new Uint8Array([1]), // Write byte with value 1.
		 *     function()
		 *     {
		 *       console.log('characteristic written.');
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('writeCharacteristic error: ' + errorCode);
		 *     });
		 */
		device.writeCharacteristic = function(arg1, arg2, arg3, arg4, arg5)
		{
			if ('function' == typeof arg3)
			{
				// Service UUID is missing.
				internal.writeCharacteristic(device, arg1, arg2, arg3, arg4);
			}
			else
			{
				// Service UUID is present.
				internal.writeServiceCharacteristic(device, arg1, arg2, arg3, arg4, arg5);
			}
		};

		/**
		 * <strong>Deprecated</strong>.
		 * Use function {@link evothings.easyble.EasyBLEDevice#writeCharacteristic}
		 * @deprecated
		 * @instance
		 */
		device.writeServiceCharacteristic = function(
			serviceUUID, characteristicUUID, value, success, fail)
		{
			internal.writeServiceCharacteristic(
				device, serviceUUID, characteristicUUID, value, success, fail);
		};

		/**
		 * Write value of a characteristic for a specific service without response.
		 * This faster but not as fail safe as writing with response.
		 * Asks the remote device to NOT send a confirmation message.
		 * Experimental, implemented on Android.
		 * @param {string} serviceUUID - UUID of service that has the characteristic.
		 * @param {string} characteristicUUID - UUID of characteristic to write to.
		 * @param {ArrayBufferView} value - Value to write.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success().
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.writeCharacteristicWithoutResponse(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     new Uint8Array([1]), // Write byte with value 1.
		 *     function()
		 *     {
		 *       console.log('data sent.');
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('writeCharacteristicWithoutResponse error: ' + errorCode);
		 *     });
		 */
		device.writeCharacteristicWithoutResponse = function(
			serviceUUID, characteristicUUID, value, success, fail)
		{
			internal.writeServiceCharacteristicWithoutResponse(
				device, serviceUUID, characteristicUUID, value, success, fail);
		};

		/**
		 * <strong>Deprecated</strong>.
		 * Use function {@link evothings.easyble.EasyBLEDevice#writeCharacteristicWithoutResponse}
		 * @deprecated
		 * @instance
		 */
		device.writeServiceCharacteristicWithoutResponse = function(
			serviceUUID, characteristicUUID, value, success, fail)
		{
			internal.writeServiceCharacteristicWithoutResponse(
				device, serviceUUID, characteristicUUID, value, success, fail);
		};

		/**
		 * Write value of descriptor.
		 * @param {string} serviceUUID - UUID of service that has the given
		 * characteristic (previous versions of this library allowed leaving out
		 * the service UUID, this is unsafe practice and has been deprecated, always
		 * specify the service UUID).
		 * @param {string} characteristicUUID - UUID of characteristic for descriptor.
		 * @param {string} descriptorUUID - UUID of descriptor to write to.
		 * @param {ArrayBufferView} value - Value to write.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success().
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @public
		 * @instance
		 * @example
		 *   device.writeDescriptor(
		 *     serviceUUID,
		 *     characteristicUUID,
		 *     descriptorUUID,
		 *     new Uint8Array([1]), // Write byte with value 1.
		 *     function()
		 *     {
		 *       console.log('descriptor written.');
		 *     },
		 *     function(errorCode)
		 *     {
		 *       console.log('writeDescriptor error: ' + errorCode);
		 *     });
		 */
		device.writeDescriptor = function(arg1, arg2, arg3, arg4, arg5, arg6)
		{
			if ('function' == typeof arg4)
			{
				// Service UUID is missing.
				internal.writeDescriptor(device, arg1, arg2, arg3, arg4, arg5);
			}
			else
			{
				// Service UUID is present.
				internal.writeServiceDescriptor(device, arg1, arg2, arg3, arg4, arg5, arg6);
			}
		};

		/**
		 * <strong>Deprecated</strong>.
		 * Use function {@link evothings.easyble.EasyBLEDevice#writeDescriptor}
		 * @deprecated
		 * @instance
		 */
		device.writeServiceDescriptor = function(
			serviceUUID, characteristicUUID, descriptorUUID, value, success, fail)
		{
			internal.writeServiceDescriptor(
				device,
				serviceUUID,
				characteristicUUID,
				descriptorUUID,
				value,
				success,
				fail);
		};

		/**
		 * @typedef {Object} evothings.easyble.NotificationOptions
		 * @description Options object for functions
		 * {@link evothings.easyble.EasyBLEDevice#enableNotification}
		 * and {@link evothings.easyble.EasyBLEDevice#disableNotification}.
		 * @property {boolean} writeConfigDescriptor - Supported on Android, ignored on iOS.
		 * Set to false to disable automatic writing of notification or indication
		 * config descriptor value. This is useful in special cases when full control
		 * of writing the config descriptor is needed.
		 */

		/**
		 * Subscribe to value updates of a characteristic.
		 * The success function will be called repeatedly whenever there
		 * is new data available.
		 * <p>On Android you can disable automatic write of notify/indicate and write
		 * the configuration descriptor yourself, supply an options object as
		 * last parameter, see example below.</p>
		 * @param {string} serviceUUID - UUID of service that has the given
		 * characteristic (previous versions of this library allowed leaving out
		 * the service UUID, this is unsafe practice and has been deprecated, always
		 * specify the service UUID).
		 * @param {string} characteristicUUID - UUID of characteristic to subscribe to.
		 * @param {evothings.easyble.dataCallback} success - Success callback:
		 * success(data).
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error).
		 * @param {evothings.easyble.NotificationOptions} [options] -  Optional settings.
		 * @public
		 * @instance
		 * @example
		 * // Example call:
		 * device.enableNotification(
		 *   serviceUUID,
		 *   characteristicUUID,
		 *   function(data)
		 *   {
		 *     console.log('characteristic data: ' + evothings.ble.fromUtf8(data));
		 *   },
		 *   function(errorCode)
		 *   {
		 *     console.log('enableNotification error: ' + errorCode);
		 *   });
		 *
		 * // Turn off automatic writing of the config descriptor (for special cases):
		 * device.enableNotification(
		 *   serviceUUID,
		 *   characteristicUUID,
		 *   function(data)
		 *   {
		 *     console.log('characteristic data: ' + evothings.ble.fromUtf8(data));
		 *   },
		 *   function(errorCode)
		 *   {
		 *     console.log('enableNotification error: ' + errorCode);
		 *   },
		 *   { writeConfigDescriptor: false });
		 */
		device.enableNotification = function(arg1, arg2, arg3, arg4, arg5)
		{
			if ('function' == typeof arg2)
			{
				// Service UUID is missing.
				internal.enableNotification(device, arg1, arg2, arg3, arg4);
			}
			else
			{
				// Service UUID is present.
				internal.enableServiceNotification(device, arg1, arg2, arg3, arg4, arg5);
			}
		};

		/**
		 * <strong>Deprecated</strong>.
		 * Use function {@link evothings.easyble.EasyBLEDevice#enableNotification}
		 * @deprecated
		 * @instance
		 */
		device.enableServiceNotification = function(
			serviceUUID, characteristicUUID, success, fail, options)
		{
			internal.enableServiceNotification(
				device,
				serviceUUID,
				characteristicUUID,
				success,
				fail,
				options);
		};

		/**
		 * Unsubscribe from characteristic updates to stop notifications.
		 * <p>On Android you can disable automatic write of notify/indicate and write
		 * the configuration descriptor yourself, supply an options object as
		 * last parameter, see example below.</p>
		 * @param {string} serviceUUID - UUID of service that has the given
		 * characteristic (previous versions of this library allowed leaving out
		 * the service UUID, this is unsafe practice and has been deprecated, always
		 * specify the service UUID).
		 * @param serviceUUID - UUID of service that has the given characteristic.
		 * @param characteristicUUID - UUID of characteristic to unsubscribe from.
		 * @param {evothings.easyble.emptyCallback} success - Success callback: success()
		 * @param {evothings.easyble.failCallback} fail - Error callback: fail(error)
		 * @param {evothings.easyble.NotificationOptions} [options] -  Optional settings.
		 * @public
		 * @instance
		 * @example
		 * // Example call:
		 * device.disableNotification(
		 *   serviceUUID,
		 *   characteristicUUID,
		 *   function()
		 *   {
		 *     console.log('characteristic notification disabled');
		 *   },
		 *   function(errorCode)
		 *   {
		 *     console.log('disableNotification error: ' + errorCode);
		 *   });
		 */
		device.disableNotification = function(arg1, arg2, arg3, arg4, arg5)
		{
			if ('function' == typeof arg2)
			{
				// Service UUID is missing.
				internal.disableNotification(device, arg1, arg2, arg3, arg4);
			}
			else
			{
				// Service UUID is present.
				internal.disableServiceNotification(device, arg1, arg2, arg3, arg4, arg5);
			}
		};

		/**
		 * <strong>Deprecated</strong>.
		 * Use function {@link evothings.easyble.EasyBLEDevice#disableNotification}
		 * @deprecated
		 * @instance
		 */
		device.disableServiceNotification = function(
			serviceUUID, characteristicUUID, success, fail, options)
		{
			internal.disableServiceNotification(
				device, serviceUUID, characteristicUUID, success, fail, options);
		};
	};

	/**
	 * Connect to a device.
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.connectToDevice = function(device, success, fail)
	{
		// Check that device is not already connected.
		if (device.__isConnected)
		{
			fail(evothings.easyble.error.DEVICE_ALREADY_CONNECTED);
			return;
		}

		evothings.ble.connect(
			device.address,
			// Success callback.
			function(connectInfo)
			{
				// DEBUG LOG
				console.log('BLE connect state: ' + connectInfo.state);

				if (connectInfo.state == 2) // connected
				{
					device.deviceHandle = connectInfo.deviceHandle;
					device.__uuidMap = {};
					device.__serviceMap = {};
					device.__isConnected = true;
					internal.connectedDevices[device.address] = device;

					success(device);
				}
				else if (connectInfo.state == 0) // disconnected
				{
					device.__isConnected = false;
					internal.connectedDevices[device.address] = null;

					// TODO: Perhaps this should be redesigned, as disconnect is
					// more of a status change than an error? What do you think?
					fail && fail(evothings.easyble.error.DISCONNECTED);
				}
			},
			// Error callback.
			function(errorCode)
			{
				// DEBUG LOG
				console.log('BLE connect error: ' + errorCode);

				// Set isConnected to false on error.
				device.__isConnected = false;
				internal.connectedDevices[device.address] = null;
				fail(errorCode);
			});
	};

	/**
	 * Obtain device services, them read characteristics and descriptors
	 * for the services with the given uuid(s).
	 * If serviceUUIDs is null, info is read for all services.
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readServices = function(device, serviceUUIDs, success, fail)
	{
		// Read services.
		evothings.ble.services(
			device.deviceHandle,
			function(services)
			{
				// Array that stores services.
				device.__services = [];

				for (var i = 0; i < services.length; ++i)
				{
					var service = services[i];
					service.uuid = service.uuid.toLowerCase();
					device.__services.push(service);
					device.__uuidMap[service.uuid] = service;
				}

				internal.readCharacteristicsForServices(
					device, serviceUUIDs, success, fail);
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	/**
	 * Read characteristics and descriptors for the services with the given uuid(s).
	 * If serviceUUIDs is null, info for all services are read.
	 * Internal function.
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readCharacteristicsForServices = function(device, serviceUUIDs, success, fail)
	{
		var characteristicsCallbackFun = function(service)
		{
			// Array with characteristics for service.
			service.__characteristics = [];

			return function(characteristics)
			{
				--readCounter; // Decrements the count added by services.
				readCounter += characteristics.length;
				for (var i = 0; i < characteristics.length; ++i)
				{
					var characteristic = characteristics[i];
					characteristic.uuid = characteristic.uuid.toLowerCase();
					service.__characteristics.push(characteristic);
					device.__uuidMap[characteristic.uuid] = characteristic;
					device.__serviceMap[service.uuid + ':' + characteristic.uuid] = characteristic;

					// DEBUG LOG
					//console.log('storing service:characteristic key: ' + service.uuid + ':' + characteristic.uuid);
					//if (!characteristic)
					//{
					//	console.log('  --> characteristic is null!')
					//}

					// Read descriptors for characteristic.
					evothings.ble.descriptors(
						device.deviceHandle,
						characteristic.handle,
						descriptorsCallbackFun(service, characteristic),
						function(errorCode)
						{
							fail(errorCode);
						});
				}
			};
		};

 		/**
	 	 * @private
	 	 */
		var descriptorsCallbackFun = function(service, characteristic)
		{
			// Array with descriptors for characteristic.
			characteristic.__descriptors = [];

			return function(descriptors)
			{
				--readCounter; // Decrements the count added by characteristics.
				for (var i = 0; i < descriptors.length; ++i)
				{
					var descriptor = descriptors[i];
					descriptor.uuid = descriptor.uuid.toLowerCase();
					characteristic.__descriptors.push(descriptor);
					device.__uuidMap[characteristic.uuid + ':' + descriptor.uuid] = descriptor;
					device.__serviceMap[service.uuid + ':' + characteristic.uuid + ':' + descriptor.uuid] = descriptor;
				}
				if (0 == readCounter)
				{
					// Everything is read.
					success(device);
				}
			};
		};

		// Initialize read counter.
		readCounter = 0;

		if (null != serviceUUIDs)
		{
			// Read info for service UUIDs.
			readCounter = serviceUUIDs.length;
			for (var i = 0; i < serviceUUIDs.length; ++i)
			{
				var uuid = serviceUUIDs[i].toLowerCase();
				var service = device.__uuidMap[uuid];
				if (!service)
				{
					fail(evothings.easyble.error.SERVICE_NOT_FOUND + ' ' + uuid);
					return;
				}

				// Read characteristics for service. Will also read descriptors.
				evothings.ble.characteristics(
					device.deviceHandle,
					service.handle,
					characteristicsCallbackFun(service),
					function(errorCode)
					{
						fail(errorCode);
					});
			}
		}
		else
		{
			// Read info for all services.
			readCounter = device.__services.length;
			for (var i = 0; i < device.__services.length; ++i)
			{
				// Read characteristics for service. Will also read descriptors.
				var service = device.__services[i];
				evothings.ble.characteristics(
					device.deviceHandle,
					service.handle,
					characteristicsCallbackFun(service),
					function(errorCode)
					{
						fail(errorCode);
					});
			}
		}
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @deprecated Naming is a bit confusing, internally functions
	 * named "xxxServiceYYY" are the "future-safe" onces, but in
	 * the public API functions "xxxYYY" are new "future-safe"
	 * (and backwards compatible).
	 * @private
	 */
	internal.readCharacteristic = function(device, characteristicUUID, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' +
				characteristicUUID);
			return;
		}

		evothings.ble.readCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail);
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readServiceCharacteristic = function(
		device, serviceUUID, characteristicUUID, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.readCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @deprecated Naming is a bit confusing, internally functions
	 * named "xxxServiceYYY" are the "future-safe" onces, but in
	 * the public API functions "xxxYYY" are new "future-safe"
	 * (and backwards compatible).
	 * @private
	 */
	internal.readDescriptor = function(
		device, characteristicUUID, descriptorUUID, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();
		descriptorUUID = descriptorUUID.toLowerCase();

		var descriptor = device.__uuidMap[characteristicUUID + ':' + descriptorUUID];
		if (!descriptor)
		{
			fail(evothings.easyble.error.DESCRIPTOR_NOT_FOUND + ' ' + descriptorUUID);
			return;
		}

		evothings.ble.readDescriptor(
			device.deviceHandle,
			descriptor.handle,
			success,
			fail);
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.readServiceDescriptor = function(
		device, serviceUUID, characteristicUUID, descriptorUUID, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' +
			characteristicUUID.toLowerCase() + ':' +
			descriptorUUID.toLowerCase();

		var descriptor = device.__serviceMap[key];
		if (!descriptor)
		{
			fail(evothings.easyble.error.DESCRIPTOR_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.readDescriptor(
			device.deviceHandle,
			descriptor.handle,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @deprecated Naming is a bit confusing, internally functions
	 * named "xxxServiceYYY" are the "future-safe" onces, but in
	 * the public API functions "xxxYYY" are new "future-safe"
	 * (and backwards compatible).
	 * @private
	 */
	internal.writeCharacteristic = function(
		device, characteristicUUID, value, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' +
				characteristicUUID);
			return;
		}

		evothings.ble.writeCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			value,
			function()
			{
				success();
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	/**
	* Called from evothings.easyble.EasyBLEDevice.
	* @private
	*/
	internal.writeServiceCharacteristic = function(
		device, serviceUUID, characteristicUUID, value, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.writeCharacteristic(
			device.deviceHandle,
			characteristic.handle,
			value,
			success,
			fail);
	};

	/**
	* Called from evothings.easyble.EasyBLEDevice.
	* @private
	*/
	internal.writeServiceCharacteristicWithoutResponse = function(
		device, serviceUUID, characteristicUUID, value, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		// DEBUG LOG
		//console.log('internal.writeServiceCharacteristicWithoutResponse key: ' + key)
		//console.log('internal.writeServiceCharacteristicWithoutResponse serviceMap:')
		for (var theKey in device.__serviceMap)
		{
			console.log('  ' + theKey);
		}

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.writeCharacteristicWithoutResponse(
			device.deviceHandle,
			characteristic.handle,
			value,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @deprecated Naming is a bit confusing, internally functions
	 * named "xxxServiceYYY" are the "future-safe" onces, but in
	 * the public API functions "xxxYYY" are new "future-safe"
	 * (and backwards compatible).
	 * @private
	 */
	internal.writeDescriptor = function(
		device, characteristicUUID, descriptorUUID, value, success, fail)
	{
		characteristicUUID = characteristicUUID.toLowerCase();
		descriptorUUID = descriptorUUID.toLowerCase();

		var descriptor = device.__uuidMap[characteristicUUID + ':' + descriptorUUID];
		if (!descriptor)
		{
			fail(evothings.easyble.error.DESCRIPTOR_NOT_FOUND + ' ' + descriptorUUID);
			return;
		}

		evothings.ble.writeDescriptor(
			device.deviceHandle,
			descriptor.handle,
			value,
			function()
			{
				success();
			},
			function(errorCode)
			{
				fail(errorCode);
			});
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.writeServiceDescriptor = function(
		device, serviceUUID, characteristicUUID, descriptorUUID, value, success, fail)
	{
		var key = serviceUUID.toLowerCase() + ':' +
			characteristicUUID.toLowerCase() + ':' +
			descriptorUUID.toLowerCase();

		var descriptor = device.__serviceMap[key];
		if (!descriptor)
		{
			fail(evothings.easyble.error.DESCRIPTOR_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.writeDescriptor(
			device.deviceHandle,
			descriptor.handle,
			value,
			success,
			fail);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @deprecated Naming is a bit confusing, internally functions
	 * named "xxxServiceYYY" are the "future-safe" onces, but in
	 * the public API functions "xxxYYY" are new "future-safe"
	 * (and backwards compatible).
	 * @private
	 */
	internal.enableNotification = function(
		device, characteristicUUID, success, fail, options)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' +
				characteristicUUID);
			return;
		}

		evothings.ble.enableNotification(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail,
			options);
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.enableServiceNotification = function(
		device, serviceUUID, characteristicUUID, success, fail, options)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.enableNotification(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail,
			options);
	};

 	/**
 	 * Called from evothings.easyble.EasyBLEDevice.
	 * @deprecated Naming is a bit confusing, internally functions
	 * named "xxxServiceYYY" are the "future-safe" onces, but in
	 * the public API functions "xxxYYY" are new "future-safe"
	 * (and backwards compatible).
	 * @private
	 */
	internal.disableNotification = function(
		device, characteristicUUID, success, fail, options)
	{
		characteristicUUID = characteristicUUID.toLowerCase();

		var characteristic = device.__uuidMap[characteristicUUID];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' +
				characteristicUUID);
			return;
		}

		evothings.ble.disableNotification(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail,
			options);
	};

	/**
	 * Called from evothings.easyble.EasyBLEDevice.
	 * @private
	 */
	internal.disableServiceNotification = function(
		device, serviceUUID, characteristicUUID, success, fail, options)
	{
		var key = serviceUUID.toLowerCase() + ':' + characteristicUUID.toLowerCase();

		var characteristic = device.__serviceMap[key];
		if (!characteristic)
		{
			fail(evothings.easyble.error.CHARACTERISTIC_NOT_FOUND + ' ' + key);
			return;
		}

		evothings.ble.disableNotification(
			device.deviceHandle,
			characteristic.handle,
			success,
			fail,
			options);
	};

	/**
	 * Prints and object for debugging purposes.
	 * @deprecated. Defined here for backwards compatibility.
	 * Use evothings.printObject().
	 * @public
	 */
	evothings.easyble.printObject = evothings.printObject;

 	/**
 	 * Reset the BLE hardware. Can be time consuming.
	 * @public
	 */
	evothings.easyble.reset = function()
	{
		evothings.ble.reset();
	};
})();


// --------------------------------------------------


// File: eddystone.js

// This library scans for Eddystone beacons and translates their
// advertisements into user-friendly variables.
// The protocol specification is available at:
// https://github.com/google/eddystone

;(function() {

// prerequisites
evothings.__NOOP_FUN__([
	'libs/evothings/easyble/easyble.js',
])

/**
 * @namespace
 * @description <p>Library for Eddystone beacons.</p>
 * <p>It is safe practise to call function {@link evothings.scriptsLoaded}
 * to ensure dependent libraries are loaded before calling functions
 * in this library.</p>
 */
evothings.eddystone = {};

// constants
var BLUETOOTH_BASE_UUID = '-0000-1000-8000-00805f9b34fb';

// false when scanning is off. true when on.
var isScanning = false;

/**
 * @description Starts scanning for Eddystone devices.
 * <p>Found devices and errors will be reported to the supplied callbacks.</p>
 * <p>Will keep scanning indefinitely until you call stopScan().</p>
 * <p>To conserve energy, call stopScan() as soon as you've found the device
 * you're looking for.</p>
 * <p>Calling startScan() while scanning is in progress will produce an error.</p>
 *
 * @param {evothings.eddystone.scanCallback} - Success function called
 * when a beacon is found.
 * @param {evothings.eddystone.failCallback} - Error callback: fail(error).
 *
 * @public
 *
 * @example
 *   evothings.eddystone.startScan(
 *     function(beacon)
 *     {
 *       console.log('Found beacon: ' + beacon.url);
 *     },
 *     function(error)
 *     {
 *       console.log('Scan error: ' + error);
 *     });
 */
evothings.eddystone.startScan = function(scanCallback, failCallback)
{
	// Internal callback variable names.
	var win = scanCallback;
	var fail = failCallback;

	// If scanning is already in progress, fail.
	if(isScanning)
	{
		fail("Scanning already in progress!");
		return;
	}

	isScanning = true;

	// The device object given in this callback is reused by easyble.
	// Therefore we can store data in it and expect to have the data still be there
	// on the next callback with the same device.
	evothings.easyble.startScan(
		// Scan for Eddystone Service UUID.
		// This enables background scanning on iOS (and Android).
		['0000FEAA-0000-1000-8000-00805F9B34FB'],
		function(device)
		{
			// A device might be an Eddystone if it has advertisementData...
			var ad = device.advertisementData;
			if(!ad) return;
			// With serviceData...
			var sd = ad.kCBAdvDataServiceData;
			if(!sd) return;
			// And the 0xFEAA service.
			var base64data = sd['0000feaa'+BLUETOOTH_BASE_UUID];
			if(!base64data) return;
			var byteArray = evothings.util.base64DecToArr(base64data);

			// If the data matches one of the Eddystone frame formats,
			// we can forward it to the user.
			if(parseFrameUID(device, byteArray, win, fail)) return;
      if(parseFrameEID(device, byteArray, win, fail)) return;
			if(parseFrameURL(device, byteArray, win, fail)) return;
			if(parseFrameTLM(device, byteArray, win, fail)) return;
		},
		function(error)
		{
			fail(error);
		});
}

/**
 * @description This function is a parameter to startScan() and
 * is called when a beacons is discovered/updated.
 * @callback evothings.eddystone.scanCallback
 * @param {evothings.eddystone.EddystoneDevice} beacon - Beacon
 * found during scanning.
 */

/**
 * @description This function is called when an operation fails.
 * @callback evothings.eddystone.failCallback
 * @param {string} errorString - A human-readable string that
 * describes the error that occurred.
 */

/**
 * @description Object representing a BLE device. Inherits from
 * {@link evothings.easyble.EasyBLEDevice}.
 * Which properties are available depends on which packets types broadcasted
 * by the beacon. Properties may be undefined. Typically properties are populated
 * as scanning processes.
 * @typedef {Object} evothings.eddystone.EddystoneDevice
 * @property {string} url - An Internet URL.
 * @property {number} txPower - A signed integer, the signal strength in decibels,
 * factory-measured at a range of 0 meters.
 * @property {Uint8Array} nid - 10-byte namespace ID.
 * @property {Uint8Array} bid - 6-byte beacon ID.
 * @property {number} voltage - Device's battery voltage, in millivolts,
 * or 0 (zero) if device is not battery-powered.
 * @property {number} temperature - Device's ambient temperature in 256:ths of
 * degrees Celcius, or 0x8000 if device has no thermometer.
 * @property {number} adv_cnt - Count of advertisement frames sent since device's startup.
 * @property {number} dsec_cnt - Time since device's startup, in deci-seconds
 * (10 units equals 1 second).
*/

/**
 * @description Stop scanning for Eddystone devices.
 * @public
 * @example
 *   evothings.eddystone.stopScan();
 */
evothings.eddystone.stopScan = function()
{
	evothings.easyble.stopScan();
	isScanning = false;
}

/**
 * @description Calculate the accuracy (distance in meters) of the beacon.
 * <p>The beacon distance calculation uses txPower at 1 meters, but the
 * Eddystone protocol reports the value at 0 meters. 41dBm is the signal
 * loss that occurs over 1 meter, this value is subtracted by default
 * from the reported txPower. You can tune the calculation by adding
 * or subtracting to param txPower.<p>
 * <p>Note that the returned distance value is not accurate, and that
 * it fluctuates over time. Sampling/filtering over time is recommended
 * to obtain a stable value.<p>
 * @public
 * @param txPower The txPower of the beacon.
 * @param rssi The RSSI of the beacon, subtract or add to this value to
 * tune the dBm strength. 41dBm is subtracted from this value in the
 * distance algorithm used by calculateAccuracy.
 * @return Distance in meters, or null if unable to compute distance
 * (occurs for example when txPower or rssi is undefined).
 * @example
 *   // Note that beacon.txPower and beacon.rssi many be undefined,
 *   // in which case calculateAccuracy returns null. This happens
 *   // before txPower and rssi have been reported by the beacon.
 *   var distance = evothings.eddystone.calculateAccuracy(
 *       beacon.txPower, beacon.rssi);
 */
evothings.eddystone.calculateAccuracy = function(txPower, rssi)
{
	if (!rssi || rssi >= 0 || !txPower)
	{
		return null
	}

	// Algorithm
	// http://developer.radiusnetworks.com/2014/12/04/fundamentals-of-beacon-ranging.html
	// http://stackoverflow.com/questions/21338031/radius-networks-ibeacon-ranging-fluctuation

	// The beacon distance formula uses txPower at 1 meters, but the Eddystone
	// protocol reports the value at 0 meters. 41dBm is the signal loss that
	// occurs over 1 meter, so we subtract that from the reported txPower.
	var ratio = rssi * 1.0 / (txPower - 41)
	if (ratio < 1.0)
	{
		return Math.pow(ratio, 10)
	}
	else
	{
		var accuracy = (0.89976) * Math.pow(ratio, 7.7095) + 0.111
		return accuracy
	}
}

/**
 * Create a low-pass filter.
 * @param cutOff The filter cut off value.
 * @return Object with two functions: filter(value), value()
 * @example
 *   // Create filter with cut off 0.8
 *   var lowpass = evothings.eddystone.createLowPassFilter(0.8)
 *   // Filter value (returns current filter value)
 *   distance = lowpass.filter(distance)
 *   // Get current value
 *   distance = lowpass.value()
 */
evothings.eddystone.createLowPassFilter = function(cutOff, state)
{
	// Filter cut off.
	if (undefined === cutOff) { cutOff = 0.8 }

	// Current value of the filter.
	if (undefined === state) { state = 0.0 }

	// Return object with filter functions.
	return {
		// This function will filter the given value.
		// Returns the current value of the filter.
		filter: function(value)
		{
			state =
				(value * (1.0 - cutOff)) +
				(state * cutOff)
			return state
		},
		// This function returns the current value of the filter.
		value: function()
		{
			return state
		}
	}
}

// Return true on frame type recognition, false otherwise.
function parseFrameUID(device, data, win, fail)
{
	if(data[0] != 0x00) return false;

	// The UID frame has 18 bytes + 2 bytes reserved for future use
	// https://github.com/google/eddystone/tree/master/eddystone-uid
	// Check that we got at least 18 bytes.
	if(data.byteLength < 18)
	{
		fail("UID frame: invalid byteLength: "+data.byteLength);
		return true;
	}

	device.txPower = evothings.util.littleEndianToInt8(data, 1);
	device.nidRaw = data.subarray(2, 12);  // Namespace ID.
	device.bidRaw = data.subarray(12, 18); // Beacon ID.
	device.nid = evothings.util.decArrToHex(device.nidRaw);
	device.bid = evothings.util.decArrToHex(device.bidRaw);
	device.uid = device.nid + device.bid;
	device.uidBase64 = evothings.util.decArrToBase64(data.subarray(2, 18));

	win(device);

	return true;
}

function parseFrameEID(device, data, win, fail)
{
    if(data[0] != 0x30) return false;

    if(data.byteLength < 10)
    {
        fail("EID frame: invalid byteLength: "+data.byteLength);
        return true;
    }

    device.txPower = evothings.util.littleEndianToInt8(data, 1);
    device.eidRaw = data.subarray(2, 10);  // EID.
		device.eid = evothings.util.decArrToHex(device.eidRaw);
		device.eidBase64 = evothings.util.decArrToBase64(device.eidRaw);
		device.eidGoogle = "beacons/4!" + device.eid.toLowerCase();

    win(device);

    return true;
}

function parseFrameURL(device, data, win, fail)
{
	if(data[0] != 0x10) return false;

	if(data.byteLength < 4)
	{
		fail("URL frame: invalid byteLength: "+data.byteLength);
		return true;
	}

	device.txPower = evothings.util.littleEndianToInt8(data, 1);

	// URL scheme prefix
	var url;
	switch(data[2]) {
		case 0: url = 'http://www.'; break;
		case 1: url = 'https://www.'; break;
		case 2: url = 'http://'; break;
		case 3: url = 'https://'; break;
		default: fail("URL frame: invalid prefix: "+data[2]); return true;
	}

	// Process each byte in sequence.
	var i = 3;
	while(i < data.byteLength)
	{
		var c = data[i];
		// A byte is either a top-domain shortcut, or a printable ascii character.
		if(c < 14)
		{
			switch(c)
			{
				case 0: url += '.com/'; break;
				case 1: url += '.org/'; break;
				case 2: url += '.edu/'; break;
				case 3: url += '.net/'; break;
				case 4: url += '.info/'; break;
				case 5: url += '.biz/'; break;
				case 6: url += '.gov/'; break;
				case 7: url += '.com'; break;
				case 8: url += '.org'; break;
				case 9: url += '.edu'; break;
				case 10: url += '.net'; break;
				case 11: url += '.info'; break;
				case 12: url += '.biz'; break;
				case 13: url += '.gov'; break;
			}
		}
		else if(c < 32 || c >= 127)
		{
			// Unprintables are not allowed.
			fail("URL frame: invalid character: "+data[2]);
			return true;
		}
		else
		{
			url += String.fromCharCode(c);
		}

		i += 1;
	}

	// Set URL field of the device.
	device.url = url;

	win(device);

	return true;
}

function parseFrameTLM(device, data, win, fail)
{
	if(data[0] != 0x20) return false;

	if(data[1] != 0x00)
	{
		fail("TLM frame: unknown version: "+data[1]);

		return true;
	}

	if(data.byteLength != 14)
	{
		fail("TLM frame: invalid byteLength: "+data.byteLength);

		return true;
	}

	device.voltage = evothings.util.bigEndianToUint16(data, 2);

	var temp = evothings.util.bigEndianToUint16(data, 4);
	if(temp == 0x8000)
	{
		device.temperature = 0x8000;
	}
	else
	{
		device.temperature = evothings.util.bigEndianToInt16(data, 4) / 256.0;
	}

	device.adv_cnt = evothings.util.bigEndianToUint32(data, 6);
	device.dsec_cnt = evothings.util.bigEndianToUint32(data, 10);

	win(device);

	return true;
}

var isAdvertising = false;

function isValidHex(str, len) {
  return typeof str === "string" && str.length === len * 2 && /^[0-9A-F]+$/.test(str)
}

function txPowerLevel() {
  // ADVERTISE_TX_POWER_MEDIUM taken from
	// txeddystone_uid/MainActivity.java#L324-L340 (https://goo.gl/MqWqUu)
  return -26
}

// From [txeddystone_uid/MainActivity.java](https://goo.gl/VGtnN1)
function toByteArray(hexString) {
  var out = [];

  for (var i = 0; i < hexString.length; i += 2) {
    out.push((parseInt(hexString.charAt(i), 16) << 4)
        + parseInt(hexString.charAt(i + 1), 16));
  }

  return out;
}

// Variable that points to the Cordova Base64 module, loaded lazily.
var base64;

function buildServiceData(namespace, instance) {
  if (!base64) { base64 = cordova.require('cordova/base64'); }

  var data = [0, txPowerLevel()];

  Array.prototype.push.apply(data, toByteArray(namespace));
  Array.prototype.push.apply(data, toByteArray(instance));

  return base64.fromArrayBuffer(new Uint8Array(data));
}

/**
 * @description Start Advertising Eddystone Beacon.
 * <p>Namespace may only be 10 hex bytes</p>
 * <p>Instance may only be 6 hex bytes</p>
 * <p>Will keep advertising indefinitely until you call stopAdvertise().</p>
 * @public
 * @param {string} namespace - Hex namespace string (10 bytes, 20 chars)
 * @param {string} instance - Hex instance string (6 bytes, 12 chars)
 * @param {evothings.eddystone.advertiseCallback} - Success function called when advertising started
 * @param {evothings.eddystone.failCallback} - Error callback: fail(error).
 * @example
 *   evothings.eddystone.startAdvertise("0123456789ABCDEF0123", "0123456789AB");
 */
evothings.eddystone.startAdvertise = function(namespace, instance, advertiseCallback, failCallback) {
	// Internal callback variable names.
	var win = advertiseCallback;
	var fail = failCallback;

	if(isAdvertising) {
		fail("Advertising already in progress!");
		return;
	}

  if (!isValidHex(namespace, 10)) {
    fail("Invalid namespace, must be 10 hex bytes");
    return;
  }
  if (!isValidHex(instance, 6)) {
    fail("Invalid instance, must be 6 hex bytes");
    return;
  }

  var serviceData = buildServiceData(namespace, instance);

  var transmitData = {
    serviceUUIDs: ["0000FEAA-0000-1000-8000-00805F9B34FB"],
    serviceData: { "0000FEAA-0000-1000-8000-00805F9B34FB": serviceData }
  };

  var settings = {
    broadcastData: transmitData,
    scanResponseData: transmitData
  };

  evothings.ble.peripheral.startAdvertise(
  	settings,
  	function() {
  	  isAdvertising = true;
  	  win() },
  	function(error) {
  	  isAdvertising = false;
  	  fail(error) });
}

/**
 * @description Stop Advertising Eddystone Beacon.
 * @public
 * @param {Function} onSuccess - Success function called when advertising stoppped
 * @param {evothings.eddystone.failCallback} - Error callback: fail(error).
 * @example
 *   evothings.eddystone.stopAdvertise();
 */
evothings.eddystone.stopAdvertise = function(onSuccess, failCallback) {
  isAdvertising = false;
	evothings.ble.peripheral.stopAdvertise(onSuccess, failCallback);
}

})();


// --------------------------------------------------


// File: eddystone-exports.js
//
// Export Eddystone JavaScript library (not needed really
// since it is already globally defined, is here if this
// would change in the future).
//

module.exports = window.evothings.eddystone;
