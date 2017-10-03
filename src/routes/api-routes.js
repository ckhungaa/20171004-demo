"use strict"
var express = require('express')
var lalamove = require('./lalamove/route')

var router = express.Router()
router.use('/route',lalamove)
module.exports = router
