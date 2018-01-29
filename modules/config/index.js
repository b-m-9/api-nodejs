'use strict';
/**
 * Created by bogdanmedvedev on 11.01.18.
 */
const fs = require('fs'),
    path = require('path'),
    nconf = require('nconf'),
    error = require('../../modules/error'),
    log = require('../../modules/log'),
    _path_config = _path_root+'config/';
var statusSaveConfig = true;
function reloadConfig() {

    try {
        if (statusSaveConfig) {
            nconf.argv().env().file({file: _path_config + 'app_config.json'});
        }
    } catch (e) {
        setTimeout(reloadConfig, 5000);
        log.error('File app_config.json [format Error]:', e);
    }

}
reloadConfig();

function saveConfig() {
    if (model.get('server:server:logs:app_config')) log.info('[app_config save] starting...');
    statusSaveConfig = false;
    nconf.save(function (err) {
        if (err) return new error('core/createConfig.js/nconf.save :' + err);
        if (model.get('server:server:logs:app_config')) log.info('[app_config save] saved and read new app_config starting...');

        fs.readFile(_path_config + 'app_config.json', function (err, data) {
            if (model.get('server:server:logs:app_config')) log.info('[app_config save] saved and JSON.parse new app_config starting...');
            if (err) return new error('core/createConfig.js/fs.readFile :' + err);
            try {
                let res = JSON.parse(data);
                if (model.get('server:server:logs:app_config')) log.info('[app_config save] saved and read new app_config to JSON');
                if (model.get('server:server:logs:app_config')) console.log('[app_config]', res);
                statusSaveConfig = true;
            } catch (e) {
                log.error('File app_config.json [Error read format]: see app_config.json saveConfig' + e);
            }
        });
    });
}

const model = {
    set: (param, value, testWrite, dontSave)=> {
        if (model.get('server:server:logs:app_config')) log.info('[app_config set] Param:' + param + ', Value:' + value + ', testParam:' + testWrite + ',dontSave:' + dontSave);
        if (testWrite) {
            if (!nconf.get(param)) {
                nconf.set(param, value);
                return true;
            }
            return false;
        }
        nconf.set(param, value);
        if (!dontSave) saveConfig();
        return true;
    },
    get: function (param) {
        var value = nconf.get(param);
        if (param != 'server:server:logs:app_config' && model.get('server:server:logs:app_config')) log.info('[app_config get] Param:' + param + ', Value:' + value);
        return value
    },
    save: saveConfig,
    rereadConfig: reloadConfig,
    getAllToJsonConfig: (callback)=> {
        if (err)callback(err, null);
        fs.readFile(_path_config + 'app_config.json', (err, data)=> {
            if (err)callback(err, null);
            try {
                callback(null, JSON.parse(data));
            } catch (e) {
                callback('File app_config.json [Error read format]: see app_config.json getAllToJsonConfig' + e, null);

            }
        });
    }
};
module.exports = exports = model;
require('./createConfig'); // init create conf

setTimeout(()=>{
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(_path_config + 'app_config.json', {
        ignored: /[\/\\]\./,
        persistent: true
    });
    watcher.on('add', function () {
        if (model.get('server:server:logs:app_config')) log.info('[app_config watcher] .on("add")');
        reloadConfig();
    }).on('change', function () {
        if (model.get('server:server:logs:app_config')) log.info('[app_config watcher] .on("change")');
        reloadConfig();
    });
},1000*30); // watcher after 30s
