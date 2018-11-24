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
    _path_config = path.normalize(__dirname + DIR_TO_ROOT + DIR_CONFIG + '/');
if (!fs.existsSync(path.normalize(__dirname + DIR_TO_ROOT + DIR_CONFIG)))
    fs.mkdirSync(path.normalize(__dirname + DIR_TO_ROOT + DIR_CONFIG));
let statusSaveConfig = true;

function reloadConfig() {
    try {
        if (statusSaveConfig) {
            nconf.argv()
                .env().file({file: _path_config + '' + NAME_CONFIG + '.json',saveSync: true});
        }
    } catch (e) {
        setTimeout(reloadConfig, 5000);
        console.error('File ' + NAME_CONFIG + '.json [format Error]:', e);
    }

}

reloadConfig();
Object.equal = function (firstObj, secondObject) {
    let keysFirstObj = Object.keys(firstObj);
    let keysSecondObject = Object.keys(secondObject);
    if (keysFirstObj.length !== keysSecondObject.length) {
        return false;
    }
    return !keysFirstObj.filter(function (key) {
        if (typeof firstObj[key] === "object" || Array.isArray(firstObj[key])) {
            return !Object.equal(firstObj[key], secondObject[key]);
        } else {
            return firstObj[key] !== secondObject[key];
        }
    }).length;
};

function saveConfig() {
    return new Promise((resolve, reject) => {
        statusSaveConfig = false;
        fs.readFile(_path_config + '' + NAME_CONFIG + '.json', "utf8", (err, configString) => {
            if (err) return nconf.save((err) => {
                console.log('[!] Created config ' + NAME_CONFIG);
                statusSaveConfig = true;

                return resolve(true);
            });
            try {
                if (configString === '')
                    return nconf.save((err) => {
                        console.error('[WARN] Rewrite config ' + NAME_CONFIG,'SUCCESS!');
                        statusSaveConfig = true;
                        return resolve(true);
                    });
                configString = JSON.parse(configString);
                if (!Object.equal(configString, nconf.stores.file.store)) {
                    nconf.save((err) => {
                        console.log('[!] Updated config ' + NAME_CONFIG);
                        statusSaveConfig = true;

                        return resolve(true);
                    });
                } else {
                    statusSaveConfig = true;

                    return resolve(true);

                }
            } catch (e) {
                console.error('File ' + NAME_CONFIG + '.json [Error read format]: see ' + NAME_CONFIG + '.json saveConfig' + e);
                return reject('File ' + NAME_CONFIG + '.json [Error read format]: see ' + NAME_CONFIG + '.json saveConfig')
            }
        });
        //

    });
}

const model = {
    set: (param, value, testWrite, dontSave) => {

        return new Promise((resolve, reject) => {
            if (!param || typeof param !== 'string')
                return reject('param is not string');
            if (testWrite) {
                if (nconf.get(param) === undefined) {
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
