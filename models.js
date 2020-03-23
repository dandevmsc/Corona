//var mongoose = require('mongoose');

//mongoose.model('cases', new mongoose.Schema({
//    country: String,
//    region: String,
//    lastupdate: Date,

//    casesconfirmed: Int,
//    deaths: Int,
//    recovered: Int,
//    coordinates:String



//}))
var mongoose = require('mongoose');



mongoose.model('User', new mongoose.Schema({
    email: String,
    passwordHash:String
}))