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
    bar.setAttribute("style","width:"+ p*100 + '%');
    bar.textContent = p*100 + '%';
    if(p===1){
      axios.get('/crawling/result?tag=all')
        .then( r => {

        }).catch( e => {
          // error handling
          console.log('----fetching /crawling/result failed-----',e)
        })
        
    }
  }
})();


