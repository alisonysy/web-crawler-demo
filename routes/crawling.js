var express = require('express');
var router = express.Router();
const {fetchingConfig} = require('../api.config');
const {scrapePostItemsFromXHS,countDbItems,outputAndCountTagsByName} = require('../services/webCrawling');

const crawlingPageRenderObj = {
  title:'Xiaohongshu Crawling and Searching',
  slogan:'Start to fetch posts from Xiaohongshu',
  progress:undefined,
  tags:undefined
}

/* GET crawling page. */
let progress = 0;
router.get('/', function(req, res, next) {
  let {numberToFetch} = req.query;

  scrapePostItemsFromXHS(+numberToFetch,(left) => {
    progress = (numberToFetch - left) / numberToFetch;
    console.log('-------progress is------',progress);
    next();
  });
  
  res.render('crawling',{
    ...crawlingPageRenderObj,
    progress: progress
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
            res.render('crawling',{
              ...crawlingPageRenderObj,
              tags:re
            })
          }).catch( e => console.log('tags arr',e))
      }
    }
  })
});




module.exports = router;