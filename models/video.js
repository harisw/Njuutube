var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var VideoSchema = new mongoose.Schema({
    title: String,
    description: String,
    date: Date,
    oriPath: String,
    lowPath: String,
    highPath: String,
    idUser: Number,
    tags: [String]
});

VideoSchema.plugin(mongoosePaginate);
const Video = mongoose.model('Video', VideoSchema);
module.exports = Video;