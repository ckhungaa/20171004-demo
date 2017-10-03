const uuidv1 = require('uuid/v1')
var bluebird = require('bluebird')
var redis = require('redis')
var logger = require('winston')

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client = redis.createClient(6379, 'redis')

client.on('connect', function () {
    logger.info('redis connected');
});

const TOKEN_IN_PROGRESS = {
    status: 'in progress'
}

module.exports = {

    createToken: function () {
        var token = uuidv1()
        client.set(token, JSON.stringify(TOKEN_IN_PROGRESS), redis.print)
        client.expire(token, 60 * 30,redis.print)
        return token
    },

    updateToken: function (token, object) {
        client.set(token, JSON.stringify(object), redis.print)
    },

    getByToken: function (token) {
        return client.getAsync(token)
    }
}