const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name:String,
  value:String,
  score:String,
  src:String
})

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
  noteContent: String,
  type:String,
  statistics:{
    type:Map,
    of:String
  },
  tags: [tagSchema],
  posted: {
    type: Date,
    default: Date.now
  }
});

const post_xhsModel = mongoose.model('post_xhs',postSchema);

module.exports = {
  model:post_xhsModel
}