"use strict"
var ApiError = require('../error/api-error')
var _ = require('lodash')

module.exports = {
    throwIfTrue : function(condition, errorCode){
        if(condition === true){
            throw new ApiError(errorCode)            
        }
    },

    throwIfFalse: function(condition, errorCode){
        if(condition === false){
            throw new ApiError(errorCode)            
        }
    },

    throwIfEmpty: function(object, errorCode){
        this.throwIfTrue(_.isEmpty(object),errorCode)
    },

}