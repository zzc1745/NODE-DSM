var mongoose = require('../db');
var Schema = mongoose.Schema;


var flightSchema = new Schema({
    departCity: String,
    departTime: String,
    arrivalCity: String,
    arrivalTime: String,
    flightPrice: Number,
    flightBizPrice: Number,
    flightInfo: String,
    flightDuration: String
});



module.exports = mongoose.model('Flight', flightSchema);
