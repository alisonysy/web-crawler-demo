var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Xiaohongshu Crawling and Searching', 
    slogan:'Start to fetch posts from Xiaohongshu',
    arrow:{filePath:'/images/japan_1.jpeg',alt:'arrow_down'},
    maxNumberToFetch:300
  });
});

module.exports = router;
