/**
 * Created by bogdanmedvedev on 29.06.16.
 */
var geoip = require('./index.js');
console.log(geoip('30.122.13.53')); //{ ip: '30.122.13.53',counterCode: 'US',counterName: 'United States',success: true }
