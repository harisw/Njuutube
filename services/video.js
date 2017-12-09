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
        prepareVideo(newPath, userPath, newName)
            .then((videoResult) => {
                console.log("masuk sini");            
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
                    videoResult.save(function (savedVideo) {
                        return savedVideo;
                    });
                } catch (error) {
                    throw Error('Error while saving file');
                }
            });
    });
}

exports.getSingleVideo = async function(id){
    try {
        var video = await Video.findById(id);
        
        return video;
    } catch (error) {
        throw Error("Error finding video");
    }
}

async function prepareVideo(path, userPath, name){
    //Watermark the video
    await cmd.exec(`ffmpeg -y -i ${path} -i ${watermarkPath} -filter_complex "[1]lut=a=val*0.3[a];[0][a]overlay=0:0" -c:v libx264 -an ${userPath +"water_"+ name}`, (err) =>{
            if(err)
                throw err;
            console.log("manis dan selalu disiplin");                 
            cmd.exec(`ffmpeg -i ${userPath +"water_"+ name} -c:v libx264 -preset slow -crf 45 -c:a copy ${userPath +"low_"+ name}`, (err) => {
                    if(err)
                        throw err;
                    console.log("manis dan selalu disiplin");                                         
                    cmd.exec(`ffmpeg -i ${userPath +"water_"+ name} -c:v libx264 -preset slow -crf 19 -c:a copy ${userPath +"high_"+ name}`, (err) => {
                        if(err)
                            throw err;
                        console.log("manis dan selalu disiplin");                                             
                    });
            });
    });
    return { path: videoPath+name,
             low: videoPath+'low_'+name,
             high: videoPath+'high_'+name };
}