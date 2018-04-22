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
config.save();


const git = require('git-rev');
git.short((str) => {

    if(config.get('git:commitHash') !== str) {
        let version = config.get('version');
        let ver = version.split('.');
        if (+ver[2] < 999) {
            ver[2] = +ver[2];
            ver[2]++;
            if (ver[2] < 10) ver[2] = '00' + '' + ver[2];
            else if (ver[2] < 100) ver[2] = '0' + '' + ver[2];
        } else {
            if (+ver[1] < 99) {
                ver[1] = +ver[1];
                ver[1]++;
                if (ver[1] < 10) ver[1] = '0' + '' + ver[1];

            } else {
                ver[0]++;
                ver[1] = '01';
            }
            ver[2] = '001';
        }


        config.default('version', ver.join('.'), !0);
    }
    config.default('git:commitHash', str, !0);

    setTimeout(function () {
        config.save();
    }, 500)
});
config.save();