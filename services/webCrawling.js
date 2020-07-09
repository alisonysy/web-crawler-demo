const axios = require('axios');
const cheerio = require('cheerio');

const HTTPError = require('../errors/HTTPError');
const DbError = require('../errors/DbError');
const Post_xhs = require('../models/post_XHS');

const {cssUrlToImgSrc,appendBaseUrl,extractIdFromUrl} = require('../utils/urlHandling');

class Tag{
  constructor(name,val,score,src){
    this.name = name;
    this.value = val;
    this.score = score;
    this.src = src;
  }
}

async function scrapeUGCItemFromXHS(itemId){
  const url = `https://www.xiaohongshu.com/discovery/item/${itemId}`;
  const res = await axios.get(url)
    .catch( e => {
      if(e.response && e.response.status && e.response.status === 404){
        throw new HTTPError(404, e.response, 4040000, 'Resource not found.');
      }else{
        throw e;
      }
    });
  const data = res.data;
  const $ = cheerio.load(data);

  const title = $('.note-top .title').text().trim();
  const noteContent = $('.note-top + div .content').html();
  const stats = $('.bottom-gap-add .operation-block').text().split(' ').filter( i => i.length !== 0);
  const postedDate = $('.bottom-gap-add .publish-date').text().match(/\d+-\d+-\d+\s\d+\:\d+/);
  const tagField = $('.panel-card-wrap .keywords').children();
  let tags = [];
  if(tagField.length){
    for(let i=0;i < tagField.length; i++){
      let href = $(tagField[i]).attr('href');
      let t = new Tag($(tagField[i]).text().trim(),extractIdFromUrl(href,/tags\/(.+)\?name/),1,appendBaseUrl(href,'https://www.xiaohongshu.com'));
      tags.push(t);
    }
  }

  const videoSrc = $('.videoframe video').attr('src');
  const pics = $('.carousel .slide').children();
  let imageSrc;
  if(!videoSrc && pics.length){
    // the post has images and not video
    imageSrc = [];
    for(let i=0;i < pics.length; i++){
      let s = $(pics[i]).children().attr('style');
      if(s){
        imageSrc.push(cssUrlToImgSrc(s,/\/\/ci\.xiaohongshu\.com\/[^;)]+/))
      }
    }
  }

  const note = {
    id_XHS:itemId,
    title, noteContent, 
    stats:{likes:stats[0],comments:stats[1],stars:stats[2]},
    posted: postedDate? postedDate[0] : undefined,
    type: videoSrc? 'video' : (pics && pics.length)? 'normal' : undefined,
    src: videoSrc? videoSrc : imageSrc.length? imageSrc : undefined,
    tags
  }

  const creatorName = $('.right .name').text();
  const creatorProfilePic = $('.author-item .left-img').children('img').attr('src');
  const creatorStats = $('.card-info').text().split(' ').reduce((prev,cur,index,arr) => {
    if(index%2){
      prev[arr[index-1]] = cur;
    }
    return prev; 
  },{});
  const creator = {
    name:creatorName,
    profilePic:creatorProfilePic,
    stats:creatorStats
  }

  return await Post_xhs.model.updateOne({
    id_XHS:itemId
  },{
    title:note.title,
    author:creator,
    mediaContent:note.src,
    statistics:note.stats,
    tags:note.tags,
    posted:note.posted
  },{
    upsert:true
  },(err,res) => {
    if(err) throw new DbError(404,err,4040001,'cannot insert or update the post to database');
    console.log('Insert or update successfully.');
  })
  
}

scrapeUGCItemFromXHS('5f059940000000000101ee43');
//5f059940000000000101ee43 video
//5f0576d70000000001003108
// 5f02fd5e0000000001006183 video
// 5f0594b600000000010068e3 video
// 5f0302ca0000000001002f1a
// 5ebf55cc00000000010021e1
