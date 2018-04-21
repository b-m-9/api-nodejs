class API {
    constructor(config, auth_controller) {
        if (auth_controller) {
            if (auth_controller.auth_user && typeof auth_controller.auth_user === 'function')
                module.exports.user = auth_controller.auth_user;
            if (auth_controller.auth_admin && typeof auth_controller.auth_admin === 'function')
                module.exports.admin = auth_controller.auth_admin;
        }
        this.expressRouter = require('./modules/api/expressRouter');


    }

}

module.exports = API;