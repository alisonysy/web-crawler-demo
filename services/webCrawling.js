const axios = require('axios');
const cheerio = require('cheerio');

const HTTPError = require('../errors/HTTPError');
const Post_XHS = require('../models/post_XHS');

const {cssUrlToImgSrc,appendBaseUrl} = require('../utils/urlHandling');

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
      tags.push({name:$(tagField[i]).text().trim(), href:appendBaseUrl($(tagField[i]).attr('href'),'https://www.xiaohongshu.com')});
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

  return await Post_XHS.model.findOneAndUpdate({
    id_XHS:itemId
  },{
    title:note.title,
    author:creator,
    mediaContent:note.src,
    statistics:note.stats,
    tags:note.tags,
    posted:note.posted
  },{
    new:true,
    upsert:true
  })
  
}

scrapeUGCItemFromXHS('5f0302ca0000000001002f1a');
//5f059940000000000101ee43 video
//5f0576d70000000001003108
// 5f02fd5e0000000001006183 video
// 5f0594b600000000010068e3 video
// 5f0302ca0000000001002f1a
