var mongoose = require('../db');
var Schema = mongoose.Schema;


var routeSchema = new Schema({
    departCity: String,
    departCode: String,
    arrivalCity: String,
    arrivalCode: String,
    expired: Boolean
});




module.exports = mongoose.model('Route', routeSchema);
