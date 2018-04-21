'use strict';
var config = require('./index');
var random = require('../../modules/random');

// var portfinder = require('portfinder');
config.default('project_name', 'example');
config.default('shema', 'http');
config.default('domain', 'localhost:3001');
config.default('server_path', '/');
// config.default('server_path', '/service/'); // nginx conf
config.default('api_path', 'api/v1/');
config.default('server:session:secret', random.str(12,15));
config.default('server:session:ttl_hours', 48);
config.default('server:session:name', random.str(6,8));
config.default('server:api:timeout',10);
config.save();