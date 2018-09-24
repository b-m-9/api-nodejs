'use strict';
var config = require('./index');
var random = require('../../modules/random');

// var portfinder = require('portfinder');
config.default('project_name', 'API');
config.default('shema', 'http');
config.default('domain', 'localhost:3000');
config.default('server_path', '/');
// config.default('server_path', '/service/'); // nginx conf
config.default('api_path', 'api/v1/');

config.default('server:session:enable', true);
config.default('server:session:name', random.str(6,8));
config.default('server:session:secret', random.str(12,15));
config.default('server:session:ttl_hours', 48);


config.default('server:session:driver', 'local'); // or redis or pg or mongodb

config.default('server:session:database:username', '');
config.default('server:session:database:password', '');
config.default('server:session:database:database', '');
config.default('server:session:database:host', '127.0.0.1');
config.default('server:session:cookie', {});

config.default('redis:port', 6379);
config.default('redis:host', '127.0.0.1');
config.default('redis:password', '');
config.default('redis:database', 0);




config.default('server:api:timeout',10);
config.default('git:commitHash', '000000');
config.default('version', '1.0.01');
config.default('developers', [{
    name: 'Bogdan Medvedev',
    github: 'https://github.com/medve-dev',
    mail: 'bogdan.m@vidax.com'
}]);

setTimeout(function () {
    config.save();
}, 1000);