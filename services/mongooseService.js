const mongoose = require('mongoose');
const settings = require('../api.config').db;

mongoose.connect(settings.url,{useNewUrlParser:true,useUnifiedTopology:true});

const db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection error:'));
db.once('open',function(){
  console.log('Mongoose service is on.')
})

module.exports = db;