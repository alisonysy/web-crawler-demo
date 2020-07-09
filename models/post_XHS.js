const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  id_XHS:String,
  title: String,
  author: {
    type:Map,
    of:Schema.Types.Mixed
  },
  mediaContent: {
    type: Schema.Types.Mixed,
    validate: (v) => {
      return typeof v === 'string' || v instanceof Array;
    }
  },
  type:String,
  statistics:{
    type:Map,
    of:String
  },
  tags: [{
    name:String,
    href:String
  }],
  posted: {
    type: Date,
    default: Date.now
  }
});

const post_XHSModel = mongoose.model('post_XHS',postSchema);

module.exports = {
  model:post_XHSModel
}