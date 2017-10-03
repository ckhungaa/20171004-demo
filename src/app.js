"use strict"

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')

var configuration = require('./configuration')()

var apiRoutes = require('./routes/api-routes')
var errorHandler = require('./error/error-handler')



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.use('/',apiRoutes)

app.use(errorHandler)

module.exports = app
