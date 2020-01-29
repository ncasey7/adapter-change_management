const request = require('request');

const validResponseRegex = /(2\d\d)/;


/**
* The ServiceNowConnector class.
*
* @summary ServiceNow Change Request Connector
* @description This class contains properties and methods to execute the
* ServiceNow Change Request product's APIs.
*/
class ServiceNowConnector {

/**
* @memberof ServiceNowConnector
* @constructs
*
* @param {object} options - API instance options.
* @param {string} options.url - Your ServiceNow Developer instance's URL.
* @param {string} options.username - Username to your ServiceNow instance.
* @param {string} options.password - Your ServiceNow user's password.
* @param {string} options.serviceNowTable - The table target of the ServiceNow table API.
*
* @task false
*/
constructor(options) {
this.options = options;
}

/**
* @callback iapCallback
* @description A [callback function]{@link
* https://developer.mozilla.org/en-US/docs/Glossary/Callback_function}
* is a function passed into another function as an argument, which is
* then invoked inside the outer function to complete some kind of
* routine or action.
*
* @param {*} responseData - When no errors are caught, return data as a
* single argument to callback function.
* @param {error} [errorMessage] - If an error is caught, return error
* message in optional second argument to callback function.
*/

/**
* @memberof ServiceNowConnector
* @method get
* @summary Calls ServiceNow GET API
* @description Call the ServiceNow GET API. Sets the API call's method and query,
* then calls this.sendRequest(). In a production environment, this method
* should have a parameter for passing limit, sort, and filter options.
* We are ignoring that for this course and hardcoding a limit of one.
*
* @param {iapCallback} callback - Callback a function.
* @param {(object|string)} callback.data - The API's response. Will be an object if sunnyday path.
* Will be HTML text if hibernating instance.
* @param {error} callback.error - The error property of callback.
*/
get(callback) {
let getCallOptions = this.options;
getCallOptions.method = 'GET';
getCallOptions.query = 'sysparm_limit=1';
this.sendRequest(getCallOptions, (results, error) => callback(results, error));
}

post(callback) {
let getCallOptions = this.options;
getCallOptions.method = 'POST';
this.sendRequest(getCallOptions, (results, error) => callback(results, error));
}

processRequestResults(error, response, body, callback) {
// Initialize return arguments for callback
let callbackData = null;
let callbackError = null;

if (error) {
callbackError = error;
} else if (!validResponseRegex.test(response.statusCode)) {
callbackError = response;
} else if (response.body.includes('Hibernating Instance')) {
callbackData = 'Service Now instance is hibernating';
} else {
callbackData = response;
}
return (callbackData, callbackError);
}

constructUri(serviceNowTable, query=null) {
let uri = `/api/now/table/${serviceNowTable}`;
if (query) {
uri = uri + '?' + query;
}
return uri;
}

sendRequest(getCallOptions, callback) { 
//let getCallOptions = this.options;
let uri;
if (getCallOptions.query) {
uri = this.constructUri(getCallOptions.serviceNowTable, getCallOptions.query);
} else {
uri = this.constructUri(getCallOptions.serviceNowTable);
}
const requestOptions = {
method: getCallOptions.method,
auth: {
user: getCallOptions.username,
pass: getCallOptions.password,
},
baseUrl: getCallOptions.url,
uri: uri,
};

request(requestOptions, (error, response, body) => {
this.processRequestResults(error, response, body, (processedResults, processedError) => callback(processedResults, processedError));
callback(response, error);
/*if (getCallOptions.method=='GET') {
if (error) {
callback(response, error);
}
else {
callback(response, error);
}
}
if (getCallOptions.method=='POST') {
if (error) {
callback(response, error);
}
else {
callback(response, error);
}
}
*/
});
}

isHibernating(response) {
let response = this.response;
return response.body.includes('Hibernating Instance')
&& response.body.includes('<html>')
&& response.statusCode === 200;
}
}

module.exports = ServiceNowConnector;
