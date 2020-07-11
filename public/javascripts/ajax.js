(function(){
  let intId = setInterval(function(){
    axios.get('/crawling/progress').then((r) => {
      if(r.status === 200 && r.data ){
        updateProgress(r.data);
        console.log('------get from /progress----',r.data, r.data===1);
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
    bar.setAttribute("style","width:"+ p*100 + '%');
    bar.textContent = p*100 + '%';
  }
})();


