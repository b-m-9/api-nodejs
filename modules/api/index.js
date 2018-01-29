"use strict";
/**
 * Created by Bogdan Medvedev on 30.01.18.
 */
const Promise = require("bluebird");
const config = require('../../modules/config');

const authController = require('./auth.js');
const error = require('../error/api.js');
const fs = require('fs');
const random = require('../random');
let API;
if (config.get('redis.status'))
    var redis = require('redis').createClient(config.get('redis.port'), config.get('redis.host'));

let controller = {};
API = {
    saveLog(name, err, user, param, json, type, request_id) {

        console.log('API log:', name, err, param, json, type, request_id);
        // new db.logsAPI({
        //     user_id: user._id,
        //     method: name,
        //     param: param,
        //     response: json,
        //     error: err,
        //     client: {
        //         user: user.user,
        //         ip: user.ip,
        //         session: user.session,
        //     },
        //     latency_ms: json.latency_ms,
        //     request_id: request_id,
        //     type_req: type
        // }).save().catch(function (errdb) {
        //     console.error('[!!!] Error save log API', errdb, ' -0- ', name, err, user, param, json, type, request_id);
        // })
    },
    on(name, _public, cb, docs) {
        if (typeof _public == 'function') {
            docs = cb;
            cb = _public;
            _public = false
        }

        if (_public) name = 'public_' + name;
        if (!controller[name]) controller[name] = {};
        controller[name].fn = cb;
        controller[name].level = docs.level;
        if (_public)
            controller[name].level = 0;
        if (!docs.level && docs.level !== 0)
            controller[name].level = 3;

        if (docs && !docs.hide) {
            docs.method = name;
            if (_public)
                docs.access = 1;
            else
                docs.access = 2;
            if (!docs.level) {
                if (_public)
                    docs.level = 0;
                else
                    docs.level = 1;
            }
            if (docs.response) {
                docs.response.unshift({
                        name: 'success',
                        type: "string",
                        title: 'Status request method',
                        default: 'true, false'
                    },
                    {
                        name: 'error',
                        type: "object",
                        title: 'Error data.(exists only in cases of error)',
                        default: '{message,error_type,level,stack}'
                    },
                    {
                        name: 'data',
                        type: "object",
                        title: 'Result data.',
                        default: '{}'
                    });
                docs.response.push({
                    name: 'latency_ms',
                    type: "int",
                    title: 'processing time of the request (milliseconds)',
                    default: '78'
                });
            }
            docs.code = cb.toString().replace('(user, param) => {', '').replace(new RegExp('\n    }', 'g'), '').replace(new RegExp('\n        ', 'g'), '\n');
            setTimeout(function () {
                let add = true;
                for (let index in API.docs) {
                    if (API.docs[index].method === docs.method) {

                        API.docs[index] = docs;
                        add = false;
                    }
                }
                if (add) API.docs.push(docs);
            }, 1)
        }
    },
    emit(name, user, param, type) {
        let initTimestamp = (new Date()).getTime(); // start time unix call method

        let request_id = new Date().getTime() + '-' + random.str(7, 7); // reqid for login and response

        if (!type) type = 'server';
        // console.log('emit api', {name, type});
        if (!param) param = {};
        return new Promise((resolve, reject) => {
            if (!name || !controller.hasOwnProperty(name))
                return reject(error.api('method not fount', 'api', {
                    method_find: name,
                }, 0, 40400, 404));
            resolve();
        })

        // authorization controller ------------>
            .then(() => {
                // auth data
                return Promise.props({
                    user: authController.user(user),
                    admin: authController.admin(user)
                }).catch(err => {
                    console.error('Error authorization init', err);
                    return Promise.reject(err);
                })

            })
            .then(auth => {
                // check user
                return authController.checkAuth(controller[name].level, auth).catch(err => {
                    console.error('Error authorization checkAuth', err);
                    return Promise.reject(err);
                })
            })
            .then(auth => {
                // user add auth
                user.admin = auth.admin;
                user.user = auth.user;
            })
            // ---^^^^^---  authorization controller ---^^^^^^----

            //
            .then(() => {
                if (controller[name].level === 3 && type !== 'server')
                    return Promise.reject(error.api('This method can not be used for REST-API', 'forbidden', {
                        pos: 'modules/api/index.js(controller):#3',
                        level: controller[name].level
                    }, 'server', 0, 40304, 403));
                return true;
            })
            .then(() => {
                // function
                return controller[name].fn(user, param)
            })
            .then((json) => {
                // save success log
                API.saveLog(name, null, user, param, json, type, request_id);
                return json
            })
            .then((json) => {
                if (!json)
                    return Promise.reject('CORE API error {res} of undefined');
                let res = {success: true, data: json};
                res.latency_ms = (new Date()).getTime() - initTimestamp;
                res.requestId = request_id;
                return res;
            })
            // timeout promise
            .timeout(1000 * config.get('server:api:timeout'), 'API timeout')
            // ----- Error API ---------->
            .catch(err => {
                // error save log
                // if (!err || err.level > 1) console.error('API->emit(name, user, param, cb, type)->controller[name]->err:', err);
                API.saveLog(name, null, user, param, {success: false, result: false}, type, request_id);

                return Promise.reject(err);

            })
            .catch(err => {
                // error transfer api
                if (err.apiError)
                    return Promise.reject(err);


                // error is not api data error
                let err_message = 'no_message';
                if (err && typeof err === 'string') err_message = 'REST-API Error: ' + err;
                if (err && err.message && typeof err.message === 'string') err_message = 'REST-API Error: ' + err.message;
                return Promise.reject(error.api('REST-API Error: ' + err_message, 'api', {
                    pos: 'modules/api/index.js(controller):#200',
                    param: param,
                    level: controller[name].level,
                    type: 'api'
                }, 0, 500));
            })

            .catch(err => {
                let res = {success: false, error: err};
                res.latency_ms = (new Date()).getTime() - initTimestamp;
                res.requestId = request_id;

                return Promise.reject(res);
            }); // ---^^^^^---  Error API  ---^^^^^^----


    },
    docs: [], config:
        {
            secure: {
                http: 'HGUYFG8-4FeESmF75a-Rc2J80YJ3z-UM28pPJ07',
                api_server_key:
                    'o40445Qm-4FeESmF75a-Rc2J80YJ3z-6fwgGd',
            }

        }
    ,
    proxy: {}
    ,
    cache: {}
}
;

function requireAPI(apiPath) {
    console.log("API start:" + apiPath);
    require('../../api/' + apiPath)(API, redis);
}

fs.readdir('./api', (err, items) => {
    for (let i = 0; i < items.length; i++) {
        if (fs.statSync('./api/' + items[i]).isDirectory())
            fs.readdir('./api/' + items[i], (err, items2) => {
                for (let i2 = 0; i2 < items2.length; i2++) {
                    if (!fs.statSync('./api/' + items[i] + '/' + items2[i2]).isDirectory())
                        requireAPI(items[i] + '/' + items2[i2]);
                    else
                        console.log("API Error load:" + items[i] + '/' + items2[i2]);

                }
            });
        else
            requireAPI(items[i]);
    }

    // export_postman docs file
    setTimeout(require('./export_postman'), 3000);
    setTimeout(require('./export_insomnia'), 3000);
});
module.exports.controller = controller;
module.exports.API = API;
