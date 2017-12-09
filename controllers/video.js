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

exports.getSingleVideo = async function(req, res, next){

    var video = await videoService.getSingleVideo(req.params.id);
    console.log(video);
    const path = 'assets/sample.mp4'
    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
  
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(path, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'video/mp4',
      }
  
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(path).pipe(res)
    }
};