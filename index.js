const EventEmitter = require('events');

class APIEmitter extends EventEmitter {
}

const ApiEmitter = new APIEmitter();

class API {
    constructor(configs, options) {
        if (!configs || !configs.auth_user) configs = options;

        if (configs) {
            if (configs.auth_user && typeof configs.auth_user === 'function')
                module.exports.user = configs.auth_user;
            if (configs.auth_admin && typeof configs.auth_admin === 'function')
                module.exports.admin = configs.auth_admin;

            if (configs.redis)
                module.exports.redis = configs.redis;
        }
        this.expressRouter = require('./modules/api/expressRouter').router;
        this.API = require('./modules/api/expressRouter').API;
        this.expressSession = require('./modules/api/expressRouter').session;
        this.emitter = ApiEmitter;
        module.exports.ApiEmitter = ApiEmitter;
        ApiEmitter.emit('init', {start: !!1});
    }
}

module.exports = API;