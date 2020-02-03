// Import built-in Node.js package path.
const path = require('path');


const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

const EventEmitter = require('events').EventEmitter;

/**
* The ServiceNowAdapter class.
*
* @summary ServiceNow Change Request Adapter
* @description This class contains IAP adapter properties and methods that IAP
* brokers and applications can execute.
*/

class ServiceNowAdapter extends EventEmitter {

/**
* Here we document the ServiceNowAdapter class' callback.

* @callback ServiceNowAdapter~requestCallback
* @param {(object|string)} responseData - The entire REST API response.
* @param {error} [errorMessage] - An error thrown by REST API call.
*/

/**
* Here we document the adapter properties.
* @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
* instance's properties object.
* @property {string} url - ServiceNow instance URL.
* @property {object} auth - ServiceNow instance credentials.
* @property {string} auth.username - Login username.
* @property {string} auth.password - Login password.
* @property {string} serviceNowTable - The change request table name.
*/

/**
* @memberof ServiceNowAdapter
* @constructs
*
* @description Instantiates a new instance of the Itential ServiceNow Adapter.
* @param {string} id - Adapter instance's ID.
* @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
*/
constructor(id, adapterProperties) {
super();
this.id = id;
/**
* Note how objects call their static methods.
* Static methods are called as methods of the class.
*/
this.props = ServiceNowAdapter.validateProperties(adapterProperties);
this.connector = new ServiceNowConnector({
url: this.props.url,
username: this.props.auth.username,
password: this.props.auth.password,
serviceNowTable: this.props.serviceNowTable
});
}

/**
* Property validation was necessary under pronghorn-core release 5
* and earlier. Release 6 introduces JSON schema for this purpose,
* which makes this method unecessary.
* @memberof ServiceNowAdapter
* @method validateProperties
* @summary Validate Properties
* @description Validates proper properties exist for adapter.
*
* @param {ServiceNowAdapter~adapterProperties} properties
*/
static validateProperties(properties) {
if (!properties.url) {
throw new Error('ServiceNowAdapter: adapter property "url" required');
}
if (!properties.auth) {
throw new Error('ServiceNowAdapter: adapter property "auth" required');
}
if (!properties.auth.username) {
throw new Error('ServiceNowAdapter: adapter property "auth.username" required');
}
if (!properties.auth.password) {
throw new Error('ServiceNowAdapter: adapter property "auth.password" required');
}
if (!properties.serviceNowTable) {
throw new Error('ServiceNowAdapter: adapter property "serviceNowTable" required');
}
return properties;
}


/**
* @memberof ServiceNowAdapter
* @method connect
* @summary Connect to ServiceNow
* @description Complete a single healthcheck and emit ONLINE or OFFLINE.
*/


connect() {
this.healthcheck();
}


/**
* @memberof ServiceNowAdapter
* @method healthcheck
* @summary Check ServiceNow Health
* @description Verifies external system is available and healthy.
* Calls method emitOnline if external system is available.
*
* @param {ServiceNowAdapter~requestCallback} callback - The callback that
* handles the response.
*/
healthcheck(callback) {
//this.emitOnline();
//}
this.getRecord((result, error) => {
/**
* For this lab, complete the if else conditional
* statements that check if an error exists
* or the instance was hibernating.
*/
if (error) {
/* Write this block. */
//this.emitStatus('ONLINE');
this.emitOnline();
} else if (result === 'Service Now instance is hibernating') {
/* Write this block. */
//this.emitStatus('ONLINE');
this.emitOnline();
} else {
/* Write this block. */
//this.emitStatus('ONLINE');
this.emitOnline();
}

});
}

/**
* @memberof ServiceNowAdapter
* @method emitOffline
* @summary Emit OFFLINE
* @description Emits OFFLINE event to Itential platform to indicate external
* system is not available.
*/
emitOffline() {
this.emitStatus('OFFLINE');
log.warn('ServiceNow: Instance needs to be waken.');
}

/**
* @memberof ServiceNowAdapter
* @method emitOnline
* @summary Emit ONLINE
* @description Emits ONLINE event to Itential platform to indicate external
* system is available.
*/
emitOnline() {
this.emitStatus('ONLINE');
log.info('ServiceNow: Instance is awake.');
}


/**
* @memberof ServiceNowAdapter
* @method emitStatus
* @summary Emit an Event
* @description Helper function for emitting events.

*
* @param {string} status - The event to emit.
*/
emitStatus(status) {
this.emit(status, { id: this.id });
}

/**
* @memberof ServiceNowAdapter
* @method getRecord
* @summary Get ServiceNow Record
* @description Retrieves a record from ServiceNow.
*
* @param {ServiceNowAdapter~requestCallback} callback - The callback that
* handles the response.
*/
getRecord(callback) {
//this.get();
this.connector.get(callback);
}

/**
* @memberof ServiceNowAdapter
* @method postRecord
* @summary Create ServiceNow Record
* @description Creates a record in ServiceNow.
*
* @param {ServiceNowAdapter~requestCallback} callback - The callback that
* handles the response.
*/



postRecord(callback) {
//this.post();
this.connector.post(callback);
//connector.post((results, error)=> callback(results, error));
}
}

module.exports = ServiceNowAdapter;
