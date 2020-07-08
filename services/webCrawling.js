const axios = require('axios');
const cheerio = require('cheerio');

const HTTPError = require('../errors/HTTPError');

const {cssUrlToImgSrc} = require('../utils/urlHandling');

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
  // console.log(stats,'------',postedDate);

  const videoSrc = $('.videoframe video').attr('src');
  const pics = $('.carousel .slide').children();
  // console.log(videoSrc);
  let imageSrc;
  if(!videoSrc && pics.length){
    // the post has images and not video
    imageSrc = [];
    for(let i=0;i < pics.length; i++){
      let s = $(pics[i]).children().attr('style');
      if(s){
        imageSrc.push(cssUrlToImgSrc(s))
      }
    }
  }

  const note = {
    title, noteContent, 
    stats:{likes:stats[0],comments:stats[1],stars:stats[2]},
    posted: postedDate? postedDate[0] : undefined,
    type: videoSrc? 'video' : (pics && pics.length)? 'normal' : undefined,
    src: videoSrc? videoSrc : imageSrc.length? imageSrc : undefined
  }

  console.log(note)

  const creator = $('.card-note .right-card');
  
}

scrapeUGCItemFromXHS('5f057ced00000000010008d4');
//5f059940000000000101ee43 video
//5f0576d70000000001003108
// 5f02fd5e0000000001006183 video