(function(){
  let intId = setInterval(function(){
    axios.get('/crawling/progress').then((r) => {
      if(r.status === 200 && r.data ){
        updateProgress(r.data);
        if(r.data===1){
          clearInterval(intId);
        }
      }
      if(r.status > 300){
        throw r;
      }
    }).catch( e => {
      console.log('error occurs-----',e);
    });
  },200);

  function updateProgress(p){
    let bar = document.querySelector('.progress-bar');
    bar.setAttribute("style","width:"+ (p*100) + '%');
    console.log((p*100).toFixed(2));
    bar.textContent = (p*100).toFixed(2) + '%';
    if(p===1){
      window.location.href="http://localhost:3000/crawling/result?tag=all";
    }
  }
})();


