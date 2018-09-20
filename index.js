const EventEmitter = require('events');

class APIEmitter extends EventEmitter {
}

const ApiEmitter = new APIEmitter();

class API {
    constructor(auth_controller, options) {
        if (!auth_controller || !auth_controller.auth_user) auth_controller = options;

        if (auth_controller) {
            if (auth_controller.auth_user && typeof auth_controller.auth_user === 'function')
                module.exports.user = auth_controller.auth_user;
            if (auth_controller.auth_admin && typeof auth_controller.auth_admin === 'function')
                module.exports.admin = auth_controller.auth_admin;
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