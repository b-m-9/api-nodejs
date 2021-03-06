'use strict';
const config = require('./index');
const random = require('../../modules/random');

// var portfinder = require('portfinder');
config.default('project_name', 'API');
config.default('shema', 'http');
config.default('domain', 'localhost:3000');
config.default('server_path', '/');
// config.default('server_path', '/service/'); // nginx conf
config.default('api_path', 'api/v1/');

config.default('server:session:enable', true);
config.default('server:session:name', random.str(6, 8));
config.default('server:session:secret', random.str(12, 15));
config.default('server:session:ttl_hours', 48);

config.default('server:session:driver', 'local'); // or redis or pg or mongodb

config.default('server:session:database:username', '');
config.default('server:session:database:password', '');
config.default('server:session:database:database', '');
config.default('server:session:database:host', '127.0.0.1');
config.default('server:session:cookie', {});
config.default('server:session:saveUninitialized', true);
config.default('server:session:resave', true);

config.default('redis:port', 6379);
config.default('redis:host', '127.0.0.1');
config.default('redis:password', '');
config.default('redis:database', 0);

config.default('server:api:timeout', 10);
config.default('server:api:debug:stack', true);
config.default('server:api:debug:log', true);
config.default('server:api:debug:errorResponse', true);
config.default('server:api:debug:successResponse', false);
config.default('git:commitHash', '000000');
config.default('version', '1.0.01');
config.default('api:docs:public', true);
config.default('api:docs:user', true);
config.default('api:docs:admin', false);
config.default('api:docs:server', false);
config.default('developers', []);

setTimeout(function () {
  config.save();
}, 1000);