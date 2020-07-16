var express = require('express');
var router = express.Router();
const {fetchingConfig} = require('../api.config');
const {
  scrapePostItemsFromXHS,
  countDbItems,
  outputAndCountTagsByName,
  getPostsByTagName,
  getPostGeneralWithLimit,
  getPostsWithLimit
} = require('../services/webCrawling');
const {extractIdFromUrl} = require('../utils/urlHandling');
const fs = require('fs');
const path = require('path');

const crawlingPageRenderObj = {
  title:'Xiaohongshu Crawling and Searching',
  slogan:'Fetching posts from Xiaohongshu',
  progress:undefined,
  tags:undefined,
  posts:undefined
}

/* GET crawling page. */
let progress = 0;
router.get('/', function(req, res, next) {
  let {numberToFetch,postUrl} = req.query;

  if(postUrl.length > 0){
    postUrl = extractIdFromUrl(postUrl,/item\/(.+)/);
  }

  scrapePostItemsFromXHS(+numberToFetch,postUrl,(left) => {
    progress = (numberToFetch - left) / numberToFetch;
    console.log('-------progress is------',progress);
  });
  
  res.render('crawling',{
    ...crawlingPageRenderObj,
    progress: 0
  });
});

router.get('/progress',function(req,res,next){
  res.json(progress);
  res.end();
});

router.get('/result',function(req,res,next){
  // need to search thru db to see if there's any result
  console.log(req.params,req.query);
  countDbItems((c) => {
    if(!c){
      next('Sorry, there\'s no record in database.');
    };
    const q = req.query;
    if(q.tag){
      if(q.tag === 'all'){
        outputAndCountTagsByName()
          .then((re) => {
            re = re.map(t => t._id);
            console.log(re);
            getPostGeneralWithLimit(fetchingConfig.postNumberPerPage)
              .then((posts) => {
                let arr = [];
                posts = posts.map( p => {
                  arr.push(p.id_XHS);
                  return {
                    title:p.title,
                    cover: p.type === 'video'? p.mediaContent[1] : p.mediaContent[0],
                    author:p.author.get('name'),
                    profilePic:p.author.get('profilePic'),
                    likes:p.statistics.get('likes')
                  }
                });
                // console.log('all xhs ids------',arr);
                res.render('crawling',{
                  ...crawlingPageRenderObj,
                  slogan:'Posts that you might be interested in',
                  tags:re,
                  posts:posts
                })
              })
              .catch(postError => console.log('get post with limit failed',postError))
          }).catch( e => console.log('/result?tag=all error',e))
      }else{
        getPostsByTagName(q.tag)
          .then((re) => {
            console.log('get other tags data',re);
            res.json(re);
          }).catch( e => console.log('/result?tag=others error',e))
      }
    }
  })
});

router.post('/load',async function(req,res,next){
  const l = req.body;
  let re = await getPostGeneralWithLimit(l.limit? l.limit : 20);
  let arr = [];
  re.forEach( p => arr.push(p.id_XHS));
  // console.log('all xhs ids 2-----',arr);
  res.json(re);
});


module.exports = router;