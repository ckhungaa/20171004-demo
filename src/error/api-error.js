"use strict"

class ApiError extends Error{

    constructor(errorCode){
        super(errorCode.errorMessage)
        this.statusCode = errorCode.statusCode
        this.response = {
            status: 'failure',
            errorCode: errorCode.errorCode,
            error:errorCode.errorMessage
        }
    }
}

module.exports = ApiError