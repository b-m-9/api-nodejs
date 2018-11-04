"use strict";
const DIR_TO_ROOT = '/../../../../';

const config = require('../../modules/config');
const path = require("path");
const fs = require('fs');

if (!fs.existsSync(path.normalize(__dirname + DIR_TO_ROOT + 'api')))
    fs.mkdirSync(path.normalize(__dirname + DIR_TO_ROOT + 'api'));
if (!fs.existsSync(path.normalize(__dirname + DIR_TO_ROOT + 'api_plugins')))
    fs.mkdirSync(path.normalize(__dirname + DIR_TO_ROOT + 'api_plugins'));
const Promise = require("bluebird");
const authController = require('./auth.js');
const error = require('../error/api.js');
const TypesAPI = require('../api/Types.js');
const random = require('../random');
const APIConfig = require('../../index');
let API = {};
let redis = require('redis').createClient(config.get('redis:port'), config.get('redis:host'), {db: config.get('redis:database')});
redis.publishAPI = (method, user, data) => {
    redis.publish('api_notify', JSON.stringify({method, user, data}));
};

function stringToRGBHash(str) { // java String#hashCode
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let c = (hash & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}

let iconsClass = {
    login: 'uk-icon-sign-in',
    register: 'uk-icon-address-card-o',
    tour: 'uk-icon-road',
    logout: 'uk-icon-sign-out',
    setting: 'uk-icon-cog',
    config: 'uk-icon-cog',
    list: 'uk-icon-list',
    avatar: 'uk-icon-photo',
    friend: 'uk-icon-street-view',
    dialog: 'uk-icon-comments',
    message: 'uk-icon-comment',
    count: 'uk-icon-sort-numeric-desc',
    language: 'uk-icon-language',
    pay: 'uk-icon-credit-card',
    favorite: 'uk-icon-star',
    diploma: 'uk-icon-picture-o',
    auth: 'uk-icon-unlock',
    read: 'uk-icon-eye',
    token: 'uk-icon-key',
    mark: 'uk-icon-thumb-tack',
    redis: 'uk-icon-database',
    event: 'uk-icon-calendar',
    test: 'uk-icon-code',
    user: 'uk-icon-user',
    wallet: 'uk-icon-credit-card',
    transactions: 'uk-icon-list-ul',
    transfer: 'uk-icon-exchange',
    update: 'uk-icon-pencil',
    upload: 'uk-icon-upload',
    default: 'uk-icon-exclamation-triangle'

};
let controller = {};
let aliases = {};


function merge(array_params) {
    let object = {};
    if (array_params)
        for (let i = 0; i < array_params.length; i++) {
            if (typeof array_params[i] === "string" || typeof array_params[i] === "number" || typeof array_params[i] === "boolean") {
                object = array_params[i];
            }
            else
                for (let key in array_params[i]) {
                    if (typeof array_params[i][key] === "string" || typeof array_params[i][key] === "number" || typeof array_params[i][key] === "boolean" || (typeof array_params[i][key] === "object" && Array.isArray(array_params[i][key]))) {
                        object[key] = array_params[i][key];
                    }
                    else {
                        object[key] = Object.assign({}, object[key], array_params[i][key]);
                    }
                }
        }

    return object;
}


function parse(key, value) {
    let split = key.split(".");
    let object = {};

    //object[split[0]] = (split.length > 1) ? parse(split.slice(1).join("."), value) : value;

    if (split.length > 1) {
        object[split[0]] = parse(split.slice(1).join("."), value);
    }
    else {
        if (split[0] !== '')
            object[split[0]] = value;
        else
            object = value;
    }
    return object;
}

const stackTrace = require('stack-trace');

function getPathAPI() {
    var trace = stackTrace.get();

    return trace[2].getFileName().replace(path.normalize(__dirname + DIR_TO_ROOT + 'api/'), '').replace('.js', '')
}

function schemaParam(schema, params, key_param) {
    let newParams = [];
    if (typeof schema === 'object' && !(schema.type && schema.type.valid && typeof schema.type.valid === 'function')) {
        if (!params) params = {};

        for (let op in schema) {
            let new_key_param = key_param;
            let typeData = Array.isArray(schema[op]) ? 'array' : typeof schema[op];
            if (typeData === 'array') {
                if (Array.isArray(params[op])) {
                    let newArr = {};
                    newArr[new_key_param + op] = [];
                    for (let i in params[op]) {
                        if (new_key_param !== '') new_key_param += '.';
                        let r = schemaParam(schema[op][0], params[op][i], '');
                        if (r.error) return r;
                        newArr[new_key_param + op].push(merge(r.newParams));
                    }
                    newParams = newParams.concat([newArr]);
                }

                if (!params[op] || !params[op].length || params[op].length === 0) {
                    if (new_key_param !== '') new_key_param += '.';
                    let r = schemaParam(schema[op][0], undefined, new_key_param + op);
                    if (r.error) return r;
                    newParams = newParams.concat(r.newParams);
                }

            } else {
                if (new_key_param && new_key_param !== '') new_key_param += '.';
                let r = schemaParam(schema[op], params[op], new_key_param + op);
                if (r.error) return r;
                newParams = newParams.concat(r.newParams);
            }
        }
    } else {
        if (schema.type && typeof schema.type.valid === 'function') {
            if (params !== undefined) {
                let r = schema.type.valid(params);
                if (!r)
                    return {
                        error: {
                            param_name: key_param,
                            error_code: schema.error_code,
                            msg: 'server error invalid param',
                            type: 'function'
                        }
                    };
                if (!r.success)
                    return {error: {param_name: key_param, error_code: schema.error_code, msg: r.error, type: 'val'}};

                newParams.push(parse(key_param, r.value));
            } else {
                if (schema.required) {
                    return {
                        error: {
                            param_name: key_param,
                            error_code: schema.error_code,
                            msg: 'required',
                            type: 'val'
                        }
                    };

                }
            }
        }
    }
    return {newParams};


}

function validateParamsInMethod(name, param_s, paramName) {
    if (!param_s || typeof param_s !== 'object') {
        throw Error('#0001,error params in method: ' + name + ' - [' + paramName + ']')
    }
    if (param_s.type && param_s.error_code) {
        if (!param_s.type.name)
            throw Error('#0002,error params in method: ' + name + ' - [' + paramName + ']')
    } else {
        for (let param_name in param_s) {
            if (!param_s[param_name])
                throw Error('#0003,error params in method: ' + name + ' - [' + param_name + ']');
            if (!param_s[param_name])
                throw Error('#0005,error params in method: ' + name + ' - [' + param_name + ']');
            if (Array.isArray(param_s[param_name])) {
                if (!param_s[param_name][0])
                    throw Error('#0004,error params in method: ' + name + ' - [' + param_name + ']');

                return validateParamsInMethod(name, param_s[param_name][0], param_name)

            }
            if (!param_s[param_name].type && typeof param_s[param_name] === 'object') {
                return validateParamsInMethod(name, param_s[param_name], param_name)
            }
            if (!param_s[param_name].type)
                throw Error('#0006,error params in method: ' + name + ' - [' + param_name + ']');
            if (!param_s[param_name].type.name)
                throw Error('#0007,error params in method: ' + name + ' - [' + param_name + ']')
        }
    }
}

API = {
    _props: function (key, val) {
        if (key === 'register')
            return false;
        if (key === 'plugin')
            return false;
        if (key === 'saveLog')
            return false;
        if (key === 'call')
            return false;
        if (key === 'docs')
            return false;
        if (key === 'types')
            return false;
        API[key] = type;
    },
    plugin: {iconsClass},
    saveLog(name, err, user, param, json, type, request_id) {
        if (APIConfig.ApiEmitter) {
            APIConfig.ApiEmitter.emit('call', {method: name, user, param, error: err, response: json, request_id})
        }
        // console.log('API log:', name, err, param, json, type, request_id);
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
    createAlias: (aliasName, toMethod) => {
        if (!aliasName || typeof aliasName !== 'string') throw new Error('createAlias error aliasName is not valid');
        if (!toMethod || typeof toMethod !== 'string') throw new Error('createAlias error aliasName is not valid');
        aliases[aliasName] = toMethod;
    },
    redirect: (url, change_base) => {
        return Promise.resolve({
            mode: 'REDIRECT',
            url: (change_base || (config.get('shema') + '://' + config.get('domain'))) + '' + url
        });
    },
    register: (name, cb, docs) => {
        const _public = false;
        if (typeof name === 'function') {
            docs = cb;
            cb = name;
            name = ''
        }
        if (name !== '') name = '/' + name;

        name = getPathAPI() + name;


        if (!docs) docs = {level: 0, title: name};
        if (!docs.param) docs.param = {};
        if (!docs.ressponse) docs.ressponse = [];

        if (typeof docs.param !== 'object') throw new Error('Error api param not Object in method: ' + name);
        validateParamsInMethod(name, docs.param);
        if (!controller[name]) controller[name] = {};
        controller[name].fn = cb;
        controller[name].level = docs.level;

        if (!docs.level && docs.level !== 0)
            controller[name].level = 3;

        controller[name].infoAndControl = docs;

        if (docs && !docs.hide) {
            docs.method = name;
            docs.iconColor = stringToRGBHash(name);
            for (let index in API.plugin.iconsClass) {
                if (name.toLowerCase().indexOf(index) !== -1) {
                    docs.iconClass = API.plugin.iconsClass[index];
                    break;
                }
            }
            if (!docs.iconClass)
                docs.iconClass = API.plugin.iconsClass.default;

            if (!docs.response || !Array.isArray(docs.response))
                docs.response = [];
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
    call: (name, user, param, type) => {
        let initTimestamp = (new Date()).getTime(); // start time unix call method

        let request_id = new Date().getTime() + '-' + random.str(7, 7); // reqid for login and response

        if (!type) type = 'server';
        // console.log('emit api', {name, type});
        if (!param) param = {};
        if (aliases[name])
            name = aliases[name];
        return new Promise((resolve, reject) => {
            if (!name || !controller.hasOwnProperty(name))
                return reject(error.create('method not fount', 'api', {
                    method_find: name,
                }, 0, 40400, 404));
            resolve();
        })

        // authorization controller ------------>
            .then(() => {
                // auth data
                return Promise.props({
                    user: APIConfig.user(user),
                    admin: APIConfig.admin(user)
                }).catch(err => {
                    return Promise.reject(err);
                })

            })
            .then(auth => {
                // check user
                return authController.checkAuth(controller[name].level, auth).catch(err => {
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
                    return Promise.reject(error.create('This method can not be used for REST-API', 'forbidden', {
                        pos: 'modules/api/index.js(controller):#3',
                        level: controller[name].level
                    }, 'server', 0, 40304, 403));
                return true;
            })
            .then(() => {
                if (typeof controller[name].infoAndControl.param === 'object' && !Array.isArray(controller[name].infoAndControl.param)) {
                    let params_ = schemaParam(controller[name].infoAndControl.param, param, '');
                    if (params_.error)
                        return Promise.reject(error.create('param "' + params_.error.param_name + '" ' + params_.error.msg, 'api', {}, 0, params_.error.error_code || 500400404));
                    param = Object.assign({}, param, merge(params_.newParams));
                }
                return 'ok'
            })
            .then((status) => {
                if (status === 'ok')
                    return 'ok';
                if (!controller[name].infoAndControl.param)
                    return true;
                let cParam = {};
                if (typeof controller[name].infoAndControl.param === 'object' && Array.isArray(controller[name].infoAndControl.param)) {
                    for (let i in controller[name].infoAndControl.param) {
                        if (controller[name].infoAndControl.param.hasOwnProperty(i) && controller[name].infoAndControl.param[i].name)
                            cParam[controller[name].infoAndControl.param[i].name] = controller[name].infoAndControl.param[i];
                        if (cParam[controller[name].infoAndControl.param[i].name].required && (param[controller[name].infoAndControl.param[i].name] === undefined || param[controller[name].infoAndControl.param[i].name] === null || param[controller[name].infoAndControl.param[i].name] === ''))
                            return Promise.reject(error.create('param "' + controller[name].infoAndControl.param[i].name + '" required', 'api', {}, 0, controller[name].infoAndControl.param[i].error_code || 500400404));
                    }
                }
                for (let key in param) {
                    if (param.hasOwnProperty(key) && cParam.hasOwnProperty(key) && cParam[key].type && typeof cParam[key].type.valid === 'function') {
                        let r = cParam[key].type.valid(param[key]);
                        if (!r)
                            return Promise.reject(error.create('param "' + key + '" type error (function validator)', 'api', {}, 0, cParam[key].error_code || 500400404));
                        if (!r.success)
                            return Promise.reject(error.create('param "' + key + '" error: ' + r.error, 'api', {}, 0, cParam[key].error_code || 500400404));
                        param[key] = r.value;
                    }
                }
                return 'ok';

            })
            .then(() => {
                // function
                let call_method = controller[name].fn(user, param);
                if (!call_method || !call_method.then) {
                    // очень опасно код внутри метода выполнился  но метод нечего не вернул ПРОСТО ПИЗДЕЦ =)
                    console.log(new Error('Server error: "' + name + '" - the method did not return a promise'));
                    return Promise.reject(error.create('Server error: "' + name + '" - the method did not return a promise', 'api', {}, 10, 500));
                }
                return call_method
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
                if (json.mode === 'REDIRECT' && typeof json.url === 'string') {
                    res.redirect = json.url;
                }
                return res;
            })
            // timeout promise
            .timeout(1000 * config.get('server:api:timeout'), 'API timeout')
            // ----- Error API ---------->
            .catch(err => {
                console.error(err);

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
                console.error(err);
                let err_message = 'no_message';
                if (err && typeof err === 'string') err_message = 'REST-API Error: ' + err;
                if (err && err.message && typeof err.message === 'string') err_message = 'REST-API Error: ' + err.message;
                return Promise.reject(error.create('REST-API Error: ' + err_message, 'api', {
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
    docs: [],
    config: {
        secure: {
            http: '',
            api_server_key: '',
        }
    },
    error: error,
    types: TypesAPI,
    cache: {},
    proxy: {},
};
// alias method
API.emit = API.call;
API.on = API.register;
let API_cnt = 0;

function requireAPI(apiPath) {
    API_cnt++;
    if (apiPath.indexOf('.js') !== -1) {
        let fileAPI = require(apiPath);
        if (typeof fileAPI === 'function')
            fileAPI(API, redis);
        else
            console.error('[Error] (api/' + apiPath + ') Function is not defined:  \n\t' + '\n' +
                'module.exports = (API, redis) => {};\n')
    }
}

function readDirApi(dir) {
    fs.readdir(dir, (err, items) => {
        for (let i = 0; i < items.length; i++) {
            if (fs.statSync(dir + '/' + items[i]).isDirectory())
                readDirApi(dir + '/' + items[i])
            else
                requireAPI(dir + '/' + items[i]);
        }

    });
}

fs.readdir(path.normalize(__dirname + DIR_TO_ROOT + 'api_plugins'), (err, items) => {
    // load plugins
    for (let i = 0; i < items.length; i++) {
        if (fs.statSync(path.normalize(__dirname + DIR_TO_ROOT + 'api_plugins/' + items[i])).isDirectory()) {
            console.error("API Error load api_plugins:" + items[i] + 'is not file');
            continue;
        }


        if (items[i].indexOf('.js') !== -1) {
            let Plugin = require(path.normalize(__dirname + DIR_TO_ROOT + 'api_plugins/' + items[i]));
            if (typeof Plugin !== 'function') {
                API.plugin[items[i].replace('.js', '')] = Plugin;
                continue;

            }
            API.plugin[items[i].replace('.js', '')] = Plugin(API);
        }
    }
    //  ==========


    readDirApi(path.normalize(__dirname + DIR_TO_ROOT + 'api'))


    // export_postman docs file
    setTimeout(require('./export_postman'), 3000);
    setTimeout(require('./export_insomnia'), 3000);
    setTimeout(function () {
        console.log("API running: " + API_cnt + " files\n\t Docs " + config.get('shema') + '://' + config.get('domain') + config.get('server_path') + config.get('api_path') + 'docs/')
    }, 3000);


});
module.exports.controller = controller;
module.exports.API = API;