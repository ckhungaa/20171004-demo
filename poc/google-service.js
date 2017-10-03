var bluebird = require('bluebird')
var mapClient = require('@google/maps').createClient({
  key:'AIzaSyDCDrgW5Ucl94Dl1HHeZ3Ff0aNpRqw-BlU',
  Promise:bluebird
})

mapClient.distanceMatrix({
  origins:['22.372081,114.107877'],
  destinations:['22.284419,114.159510',"22.326442,114.167811"],

},function(err,response){
  if(err){
    console.log(err)
  }else{
    console.log(response)
  }
})
// mapClient.directions({
//   origin:'22.370039,113.933716',
//   destination:'22.359919,114.037743',
//   mode:'driving',
//   alternatives:true
// },(err,response)=>{
//   if(err){
//     console.log(err)
//   }else{
//     console.log(response.json)
//   }


// })