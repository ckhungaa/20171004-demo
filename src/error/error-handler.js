
"use strict"

var ApiError = require('./api-error')
var errorCode = require('./error-code')
var logger = require('winston')

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        logger.info('reject request:', err.response)
        res.status(err.statusCode)
            .json(err.response)

    } else {
        logger.error('un-unhandled error:', err)
        let response = {
            errorCode: errorCode.SYS_DEFAULT.errorCode,
            error: err.message
        }
        res.status(errorCode.SYS_DEFAULT.statusCode)
            .json(response)
    }

}

