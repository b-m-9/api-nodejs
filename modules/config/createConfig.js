/**
 * Created by bogdanmedvedev on 13.06.16.
 */

'use strict';
var config = require('./index');
var os = require('os');
var random = require('../../modules/random');

// var portfinder = require('portfinder');
config.set('project_name', 'example', true, true);
config.set('shema', 'http', true, true);
config.set('domain', 'localhost:3001', true, true);
config.set('server_path', '/', true, true);
// config.set('server_path', '/service/', true, true); // nginx conf
config.set('api_path', 'v1/api/', true, true);
config.set('server:session:secret', random.str(12,15), true, true);
config.set('server:session:ttl_hours', 48, true, true);
config.set('server:session:name', random.str(6,8), true, true);
config.set('server:api:timeout',10, true, true);
config.save();