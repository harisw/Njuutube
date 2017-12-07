var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
    idUser: Number,
    idVideo: Number,
    idSource: {
        type: String,
        Default: null
    },
    content: String,
    date: Date
});

const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;