var formidable = require('formidable');
var videoService = require('../services/video');

_this = this;

exports.getVideos = async function(req, res, next) {
    var page = req.query.page ? req.query.page : 1;
    var limit = req.query.limit ? req.query.limit : 10;

    try {
        var videos = await videoService.getVideos({}, page, limit);
        return res.status(200).json({status: 200, data: videos, message: "Successful get Videos"});
    } catch (error) {
        return res.status(400).json({status: 400, message: error.message});
    }
}

exports.createVideo = async function(req, res, next){

    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, file){
        var video = {
            title: fields.title,
            description: fields.description,
            user: fields.user,
            tags: fields.tags
        };
        videoService.createVideo(video, file)
            .then((savedVideo) => {
                if(savedVideo){
                    res.send(200).json({ status: 200, data: savedVideo, message: "Successfully Upload Video"});
                }
                res.send(400).json({ status: 400, message: err.message});       
            }
        );
    })
}