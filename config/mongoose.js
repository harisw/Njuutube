var mongoose = require('mongoose');
var bluebird = require('bluebird');

mongoose.Promise = bluebird;
mongoose.connect('mongodb://127.0.0.1:27017/njuutube', { useMongoClient: true})
    .then(() => { 
        console.log(`Successfully connected to MongoDB`);
    })
    .catch((err) => {
        console.log(`Error Of ${err}`);
    });