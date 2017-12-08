var exec = require('exec');
var Video = require('../models/video');
var fs = require('fs');
const watermarkPath = '/home/lpersahabatan/Documents/njuutube/public/images/water.png'
const videoPath = '/home/lpersahabatan/Documents/njuutube/public/videos/';
var cmd = require('child_process');

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
    var ext = file.videoUpload.name.split('.')[1];
    console.log(video.user);
    var newName = video.title.split(' ').join('_') + "."+ext;
    var userPath = videoPath + video.user+'/';
    var newPath = userPath+'ori_'+newName;
    console.log(newPath);
    try {
        fs.statSync(videoPath+video.user);
    } catch (error) {
        fs.mkdir(videoPath+video.user);
    }
    fs.rename(oldPath, newPath, (err) => {
        console.log(video.user);
        if(err)
            throw ("Error while renaming"+err);
        prepareVideo(newPath, userPath, newName, (err, resultVideo) => {
            if(err){
                throw ("Error while prepare video "+err);                
            }
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
            console.log(newVideo);
            try {
                console.log("masuk");
                videoResult.save()
                    .then((savedVideo) => {
                        return savedVideo;
                    });   
            } catch (error) {
                throw Error('Error while saving file');
            }
            return savedVideo
        });
    });
}

function prepareVideo(path, userPath, name, callback){
    //Watermark the video
    cmd.exec(`ffmpeg -y -i ${path} -i ${watermarkPath} -filter_complex "[1]lut=a=val*0.3[a];[0][a]overlay=0:0" -c:v libx264 -an ${userPath +"water_"+ name}`, (err) =>{
            if(err)
                throw err;
            cmd.exec(`ffmpeg -i ${userPath +"water_"+ name} -c:v libx264 -preset slow -crf 45 -c:a copy ${userPath +"low_"+ name}`, (err) => {
                    if(err)
                        throw err;
                    cmd.exec(`ffmpeg -i ${userPath +"water_"+ name} -c:v libx264 -preset slow -crf 19 -c:a copy ${userPath +"high_"+ name}`, (err) => {
                        if(err)
                                throw err;
                    });
            });
    });
    return { path: videoPath+name,
             low: 'low_'+videoPath+name,
             high: 'high_'+videoPath+name };
}