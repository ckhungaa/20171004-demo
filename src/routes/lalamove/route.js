"use strict"
var express = require('express')
var bluebird = require('bluebird')
var logger = require('winston')
var _ = require('lodash')

var errorCode = require('../../error/error-code')
var validationUtils = require('../../utils/validation-utils')
var routeService = require('../../services/route-service')

var router = express.Router()

router.post('/', function (req, res, next) {
    return bluebird.try(() => {
        logger.debug(req.body)   
        //validate input     
        validationUtils.throwIfEmpty(req.body,errorCode.ROUTE_BODY_IS_EMPTY)
        validationUtils.throwIfTrue(req.body.length < 2, errorCode.ROUTE_INVALID_LATITUDE_SIZE)
        req.body.forEach(latitude =>{
            validationUtils.throwIfFalse(latitude.length === 2, errorCode.ROUTE_INVALID_LATITUDE_FORMAT)
            latitude.forEach(param =>{
                logger.debug('latitude param:',param)
                validationUtils.throwIfFalse(!isNaN(param), errorCode.ROUTE_INVALID_LATITUDE_FORMAT)
            })
        })  
         
        return routeService.findShortestDrivingRoute(req.body)

    }).then(token =>{
        res.json({
            token:token
        })
    }).catch(err =>{
        next(err)
    })

})

router.get('/:token', function (req, res, next) {
    return bluebird.try(() =>{
        var token = req.params.token
        validationUtils.throwIfEmpty(token, errorCode.ROUTE_INVALID_TOKEN) 
        return routeService.getShotestDrivingRoute(token)       
    }).then(result =>{
        res.json(result)
    }).catch(err =>{
        next(err)
    })
    
})
module.exports = router
