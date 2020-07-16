(function(){
  let btn = document.getElementById('btnLoadMore');
  btn.addEventListener('click',function(){
    axios.post('/crawling/load',{
      limit:10
    }).then((res) => {
      console.log('loading more content successfully',res)
      let posts = res.data;
      const ul = document.querySelector('.post-card-group');
      if(ul){
        posts = posts.map( p => renderPostCard(p));
        console.log(posts);
        ul.append(...posts);
      }
    }).catch(e => console.log('loading failed',e))
  });

  function renderPostCard(data){
    let cardWrapper = document.createElement('div');
    cardWrapper.className = 'card w-100 d-inline-flex mb-4';
    let cardImg = document.createElement('img');
    cardImg.src = data.type === 'video'? data.mediaContent[1] : data.mediaContent[0];
    cardImg.classList.add('card-img-top');
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    let cardTitle = document.createElement('h6');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = data.title;
    let cardAuthor = document.createElement('div');
    cardAuthor.classList.add('card-author');
    let authorImg = document.createElement('img');
    authorImg.src = data.author.profilePic;
    authorImg.style = 'width:40px;';
    authorImg.alt = 'author profile picture';
    authorImg.classList.add('rounded-circle');
    let authorName = document.createElement('span');
    authorName.classList.add('card-author_name');
    authorName.textContent = data.author.name;
    let postLikes = document.createElement('span');
    postLikes.classList.add('card-post_likes');
    postLikes.textContent = data.statistics.likes;
    cardAuthor
      .append(authorImg,authorName,postLikes);
    cardBody
      .append(cardTitle,cardAuthor);
    cardWrapper
      .append(cardImg,cardBody);
    return cardWrapper;
  }
})();