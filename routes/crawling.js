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

const crawlingPageRenderObj = {
  title:'Xiaohongshu Crawling and Searching',
  slogan:'Start to fetch posts from Xiaohongshu',
  progress:undefined,
  tags:undefined,
  posts:undefined
}

/* GET crawling page. */
let progress = 0;
router.get('/', function(req, res, next) {
  let {numberToFetch} = req.query;

  scrapePostItemsFromXHS(+numberToFetch,(left) => {
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
            getPostGeneralWithLimit(30)
              .then((posts) => {
                posts = posts.map( p => {
                  return {
                    title:p.title,
                    cover: p.type === 'video'? p.mediaContent[1] : p.mediaContent[0],
                    author:p.author.get('name'),
                    profilePic:p.author.get('profilePic'),
                    likes:p.statistics.get('likes')
                  }
                });
                console.log('all posts are------',posts)
                res.render('crawling',{
                  ...crawlingPageRenderObj,
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




module.exports = router;