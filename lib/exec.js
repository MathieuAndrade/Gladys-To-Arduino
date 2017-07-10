const Promise = require('bluebird');

const retry = 4;

// wait time between signals in ms
const waitTimeBetweenSignals = 200;

module.exports = function(params){

	// if module serial is not present, we cannot contact the arduino
	if(!gladys.modules.serial || typeof gladys.modules.serial.sendCode !== 'function') {
		sails.log.error(`You need to install the serial module in Gladys.`);
		return Promise.reject(new Error('DEPENDENCY_MISSING'));
	}

	var id = parseInt(params.deviceType.id);
	var codeValue = parseInt(params.state.value);

	// radio is not secure transmision, we send the signals many time to be sure the signal is sent
	for (var i = 0; i <= retry; i++) {
		setTimeout(function(){ 
			gladys.modules.serial.sendCode(`{"deviceType":"${id}","value":"${codeValue}"}%`);
		}, i * waitTimeBetweenSignals);
	}
	
	return Promise.resolve();
};