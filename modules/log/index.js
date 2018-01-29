const winston = require('winston');
const transports = [

    new winston.transports.Console({
        timestamp: true, // function() { return new Date().toString() }
        colorize: true
    }),

    new winston.transports.File({ timestamp: true,filename: './debug.log' })
];

module.exports = exports = new winston.Logger({ transports: transports });