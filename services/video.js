import { exec } from 'child_process';

var Video = require('../models/video');
var fs = require('fs');
const watermarkPath = '/home/lpersahabatan/Documents/njuutube/public/images/water.png'
const videoPath = '/home/lpersahabatan/Documents/njuutube/public/videos/';

_this = this;

exports.getVideos = async function(query, page, limit){

    var options = {
        page,
        limit
    };

    try {
        var videos = await Video.paginate(query, options)

        return videos;
    } catch (error) {
        throw Error('Error while paginating Videos!');
    }
}

exports.createVideo = async function(video, file){

    var oldPath = file.videoUpload.path;
    var ext = oldPath.split('.')[1];
    var newName = video.title.split(' ').join('_') + ext;
    console.log(ext);
    var newPath = videoPath + video.user+'/ori_'+newName;

    fs.rename(oldPath, newPath, (err) => {
        if(err)
            throw err;
        var videoResult = await this.prepareVideo(newPath, newName);
        var newVideo = new Video({
            title: video.title,
            description: video.description,
            date: new Date(),
            oriPath: videoResult.path,
            lowPath: videoResult.low,
            highPath: videoResult.high,
            idUser: video.user,
            tags: video.tags
        });
        var savedVideo = await videoResult.save();
        return savedVideo;
    });
}

var prepareVideo = async function(path, name){
    //Watermark the video
    await exec(`ffmpeg -y -i ${path} -i ${watermarkPath} -filter_complex 
        "[1]lut=a=val*0.3[a];[0][a]overlay=0:0"
        -c:v libx264 -an ${videoPath + name}`, (err) =>{
            if(err)
                throw err;
    });
    await exec(`ffmpeg -i ${videoPath + name} -c:v libx264 -preset slow -crf 45 -c:a copy 
        low_${videoPath + name}`, (err) => {
            if(err)
                throw err;
    });
    await exec(`ffmpeg -i ${videoPath + name} -c:v libx264 -preset slow -crf 19 -c:a copy 
        high_${videoPath + name}`, (err) => {
            if(err)
                throw err;
    });
    return { path: videoPath+name,
             low: 'low_'+videoPath+name,
             high: 'high_'+videoPath+name };
}