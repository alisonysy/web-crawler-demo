function thumbUrlToImgSrc(thumbUrl){
  let url = thumbUrl.split('?imageView2')[0];
  const suffix = 'imageView2/2/w/1080/format/jpg';
  return url+suffix;
}

function cssUrlToImgSrc(cssUrl,matchRegExp){
  let result = cssUrl.match(matchRegExp);
  if(result && result[0]){
    return 'https:'+result[0]
  }else{
    throw new Error('Nothing matches the regular expression.')
  }
}

function appendBaseUrl(partialUrl,baseUrl){
  return baseUrl + partialUrl;
}

function extractIdFromUrl(url,matchRegExp){
  let result = url.match(matchRegExp);
  if(result && result[1]){
    return result[1];
  }else{
    throw new Error('Cannot match ID.')
  }
}

module.exports = {
  thumbUrlToImgSrc,
  cssUrlToImgSrc,
  appendBaseUrl,
  extractIdFromUrl
}