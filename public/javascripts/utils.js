window.getCookie = function(name){
  let regExp = new RegExp('(^| )'+name+'=([^;]*)(;|$)');
  let re = document.cookie.match(regExp);
  if(re && re[2]){
    return +re[2];
  }
  return null;
}