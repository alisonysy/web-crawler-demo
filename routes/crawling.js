var express = require('express');
var router = express.Router();
const {fetchingConfig} = require('../api.config');
const {scrapePostItemsFromXHS,countDbItems} = require('../services/webCrawling');

/* GET crawling page. */
let progress = 0;
router.get('/', function(req, res, next) {
  console.log(req.query);
  let {numberToFetch} = req.query;

  scrapePostItemsFromXHS(+numberToFetch,(left) => {
    progress = (numberToFetch - left) / numberToFetch;
    console.log('-------progress is------',progress);
    next();
  });
  
  res.render('crawling',{
    title:'Xiaohongshu Crawling and Searching',
    slogan:'Start to fetch posts from Xiaohongshu',
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
      res.status(404);
      next('Sorry, there\'s no record in database.');
    };
    const q = req.query;
    for (const key in q) {
      if (q.hasOwnProperty(key) && key === 'tag') {
        switch(q[key]){
          case 'all':
            console.log('all tags number is',c);
            break;
          default:
            console.log('here should handle other tags')
            break;
        }
      }
    }
    next();
  })
  
})

module.exports = router;