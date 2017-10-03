var logger = require('winston')
var _ = require('lodash')
var bluebird = require('bluebird')
var maps = require('@google/maps')
var Rx = require('rxjs/Rx');
var latitudesSubject = new Rx.Subject()
var latitudesFailSubject = new Rx.Subject()
var latitudesSuccessSubject = new Rx.Subject()

var tokenRepository = require('../repository/token-repository')

var mapClient = maps.createClient({
    key: 'AIzaSyDCDrgW5Ucl94Dl1HHeZ3Ff0aNpRqw-BlU',
    Promise: bluebird
})

module.exports = {
    publishLatitudeEvent: function (latitudesEvent) {
        latitudesSubject.next(latitudesEvent)
    }
}

throwIfStatusNotOK = function (status) {
    if (status !== 'OK') {
        throw new Error(status)
    }
}

latitudesFailSubject.subscribe(
    {
        next: event => {
            logger.debug('faile event:', event)
            var result = {
                status : 'failure',
                error: event.message
            }
            tokenRepository.updateToken(event.token, result)
        }
    }
)

latitudesSuccessSubject.subscribe(
    {
        next: event =>{
            logger.debug('success event:',event)
            tokenRepository.updateToken(event.token, event.result)
        }
    }
)
latitudesSubject.subscribe(
    {
        next: event => {
            var latitudes = _.flatMap(event.latitudes, item => _.join(item, ','))
            var token = event.token

            //find destination
            bluebird.try(() => {
                var origins = new Array(latitudes[0])
                var destinations = _.drop(latitudes)

                return bluebird.promisify(mapClient.distanceMatrix)({
                    origins: origins,
                    destinations: destinations
                }).then(response => {
                    throwIfStatusNotOK(response.json.status)

                    var elements = response.json.rows[0].elements
                    var destElement = _.reduce(elements, (result, value, key) => {
                        if (result.status !== 'OK') {
                            result = value
                        } else if (value.status === 'OK') {
                            result = value.distance.value > result.distance.value ? value : result
                        }
                        return result
                    })

                    throwIfStatusNotOK(destElement.status)

                    var origin = origins[0]
                    var destination = destinations[elements.indexOf(destElement)]
                    var waypoints = _.filter(destinations, (item) => item !== destination)
                    return bluebird.all([
                        origin,
                        waypoints,
                        destination
                    ])

                })
            }).spread((origin, waypoints, destination) => {
                logger.debug('orgin:', origin)
                logger.debug('waypoints:', waypoints)
                logger.debug('destination:', destination)

                return bluebird.promisify(mapClient.directions)({
                    origin: origin,
                    destination: destination,
                    waypoints: waypoints,
                    alternatives: true
                }).then(response => {
                    logger.debug('response:', response)
                    throwIfStatusNotOK(response.json.status)
                    var route = response.json.routes[0]
                    var legs = route.legs
                    var routeResult = {
                        status: 'success',
                        path: [],
                        total_distance: 0,
                        total_time: 0
                    }
                    legs.forEach(leg => {
                        routeResult.total_distance += leg.distance.value
                        routeResult.total_time += leg.duration.value
                    });
                    routeResult.path.push(origin)
                    route.waypoint_order.forEach(index => {
                        routeResult.path.push(waypoints[index])
                    })
                    routeResult.path.push(destination)
                    var successEvent = {
                        token: token,
                        result: routeResult
                    }
                    latitudesSuccessSubject.next(successEvent)
                })
            }).catch(err => {
                var failEvent = {
                    token: token,
                    message: err.message
                }
                latitudesFailSubject.next(failEvent)
            })
        }
    }
)

