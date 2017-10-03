module.exports = {
    SYS_DEFAULT: { statusCode: 200, errorCode: 'INTERNAL_SERVER_ERROR', errorMessage: 'Internal Server Error' },    
    ROUTE_BODY_IS_EMPTY: { statusCode: 200, errorCode: 'ROUTE_BODY_IS_EMPTY', errorMessage: 'The payload can not be empty' },        
    ROUTE_INVALID_LATITUDE_SIZE: { statusCode: 200, errorCode: 'ROUTE_INVALID_LATITUDE_SIZE', errorMessage: 'The payload parameter must contain atleast 2 latitudes as the start point and drop-off point' },        
    ROUTE_INVALID_LATITUDE_FORMAT: { statusCode: 200, errorCode: 'ROUTE_INVALID_LATITUDE_FORMAT', errorMessage: 'The payload parameter has invliad latitude format' },       
    ROUTE_INVALID_TOKEN: { statusCode: 200, errorCode: 'ROUTE_INVALID_TOKEN', errorMessage: 'The Path parameter token is invalid'},       
    
}