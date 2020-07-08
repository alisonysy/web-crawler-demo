function thumbUrlToImgSrc(thumbUrl){
  let url = thumbUrl.split('?imageView2')[0];
  const suffix = 'imageView2/2/w/1080/format/jpg';
  return url+suffix;
}

function cssUrlToImgSrc(cssUrl){
  let result = cssUrl.match(/\/\/ci\.xiaohongshu\.com\/[^;)]+/);
  if(result && result[0]){
    return 'https:'+result[0]
  }
}

module.exports = {
  thumbUrlToImgSrc,
  cssUrlToImgSrc
}