"use strict"

var routeRepository = require('../repository/token-repository')
var validationUtils = require('../utils/validation-utils')
var errorCode = require('../error/error-code')

var mapService = require('./route-event-service')

module.exports = {
    findShortestDrivingRoute: function (latitudes) {
        var token = routeRepository.createToken()
        var latitudesEvent = {
            token: token,
            latitudes: latitudes
        }
        mapService.publishLatitudeEvent(latitudesEvent)
        return token
    },

    getShotestDrivingRoute: function (token) {
        return routeRepository.getByToken(token)
            .then(obj => {
                validationUtils.throwIfEmpty(obj,errorCode.ROUTE_INVALID_TOKEN)
                return JSON.parse(obj)
            })
    }

}