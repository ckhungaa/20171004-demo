"use strict"

var winston = require('winston')

module.exports = function(){
    winston.configure({
        transports: [
    
            new winston.transports.Console({
                level: 'debug',
            })
        ]
    })    
}