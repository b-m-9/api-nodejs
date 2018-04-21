const expressRouter = require('./modules/api/expressRouter');

class API {
    constructor(config) {
        this.expressRouter = expressRouter;
    }

}

module.exports = API;