var express = require('express');
var router = express.Router();
const {fetchingConfig} = require('../api.config');
const {scrapePostItemsFromXHS} = require('../services/webCrawling');

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

module.exports = router;