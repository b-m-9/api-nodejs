'use strict';
/**
 * Created by bogdanmedvedev on 11.01.18.
 */

const DIR_TO_ROOT = '/../../../../';
const DIR_CONFIG = 'config';
const NAME_CONFIG = 'api_config';

const fs = require('fs'),
    path = require('path'),
    nconf = require('../nconf-local'),
    error = require('../../modules/error'),
    log = require('../../modules/log'),
    _path_config = path.normalize(__dirname + DIR_TO_ROOT + DIR_CONFIG + '/');
if (!fs.existsSync(path.normalize(__dirname + DIR_TO_ROOT + DIR_CONFIG)))
    fs.mkdirSync(path.normalize(__dirname + DIR_TO_ROOT + DIR_CONFIG));
let statusSaveConfig = true;

function reloadConfig() {
    try {
        if (statusSaveConfig) {
            nconf.file({file: _path_config + '' + NAME_CONFIG + '.json'});
        }
    } catch (e) {
        setTimeout(reloadConfig, 5000);
        log.error('File ' + NAME_CONFIG + '.json [format Error]:', e);
    }

}

reloadConfig();

function saveConfig() {
    return new Promise((resolve, reject) => {
        statusSaveConfig = false;
        nconf.save(function (err) {
            if (err) return new error('core/createConfig.js/nconf.save :' + err);

            fs.readFile(_path_config + '' + NAME_CONFIG + '.json', "utf8", (err, configString) => {
                if (err) return new error('core/createConfig.js/fs.readFile :' + err);
                try {
                    JSON.parse(configString);
                    statusSaveConfig = true;
                    return resolve(true);
                } catch (e) {
                    log.error('File ' + NAME_CONFIG + '.json [Error read format]: see ' + NAME_CONFIG + '.json saveConfig' + e);
                    return reject('File ' + NAME_CONFIG + '.json [Error read format]: see ' + NAME_CONFIG + '.json saveConfig')
                }
            });
        });
    });
}

const model = {
    set: (param, value, testWrite, dontSave) => {

        return new Promise((resolve, reject) => {
            if (!param || typeof param !== 'string')
                return reject('param is not string');
            if (testWrite) {
                if (!nconf.get(param)) {
                    nconf.set(param, value);
                    return resolve(true);
                }
                return resolve(false);
            }
            nconf.set(param, value);
            return resolve(true);
        }).then((status) => {
            if (!dontSave) return saveConfig();
            return true
        });
    },
    get: function (param) {

        return nconf.get(param)
    },
    save: saveConfig,
    rereadConfig: reloadConfig,
    getAllToJsonConfig: (callback) => {
        fs.readFile(_path_config + '' + NAME_CONFIG + '.json', (err, data) => {
            if (err) callback(err, null);
            try {
                callback(null, JSON.parse(data));
            } catch (e) {
                callback('File ' + NAME_CONFIG + '.json [Error read format]: see ' + NAME_CONFIG + '.json getAllToJsonConfig' + e, null);

            }
        });
    },
    default: (param, value, resave) => {
        return model.set(param, value, !resave, true);
    }
};
module.exports = model;
require('./createConfig'); // init create conf
if (fs.existsSync(_path_config + 'default.' + NAME_CONFIG + '.js'))
    require(_path_config + 'default.' + NAME_CONFIG + '.js')(model); // init create conf
