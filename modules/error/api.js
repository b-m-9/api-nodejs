"use strict";
const Promise = require("bluebird");
Error.stackTraceLimit = 30;

function create_error(message, type, stack, level, errorCode, statusCode) {
    let stack_ = (new Error()).stack.replace(new RegExp('    ', 'g'), '').replace(new RegExp('at ', 'g'), '').replace(new RegExp('Promise.(.*).err', 'g'), 'Promise').split("\n");
    let message_stack = '';
    if (stack_[2] && stack_[2].indexOf('bluebird') === -1) message_stack += stack_[2];
    if (stack_[3] && stack_[3].indexOf('bluebird') === -1) message_stack += '\n' + stack_[3];
    if (stack_[4] && stack_[4].indexOf('bluebird') === -1) message_stack += '\n' + stack_[4];
    if (stack_[5] && stack_[5].indexOf('bluebird') === -1) message_stack += '\n' + stack_[5];
    if (stack_[6] && stack_[6].indexOf('bluebird') === -1) message_stack += '\n' + stack_[6];
    if (stack_[7] && stack_[7].indexOf('bluebird') === -1) message_stack += '\n' + stack_[7];
    if (stack_[8] && stack_[8].indexOf('bluebird') === -1) message_stack += '\n' + stack_[8];
    if (stack_[9] && stack_[9].indexOf('bluebird') === -1) message_stack += '\n' + stack_[9];
    return {
        apiError: true,
        message,
        errorType: type,
        object: stack,
        level,
        errorCode,
        stack: message_stack,
        statusCode
    }
}

function validate_error(err) {
    if (err.apiError) return Promise.reject(err);
    if (err.error && err.error.apiError) return Promise.reject(err.error);

    let message = 'not message';
    let stack = 'no stack';
    if (typeof err === "string") message = err;
    if (err && typeof err.message === "string") message = err.message;
    if (err && typeof err.stack === "string") stack = err.stack;
    let err_obj = {err: err, stack};
    return Promise.reject(create_error(message, 'api', err_obj, 1, 500));
}

exports.create = create_error;
exports.validate = validate_error;
