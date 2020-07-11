const {Client} = require('@elastic/elasticsearch');
const {esNodeConfig} = require('../api.config');
const client = new Client(esNodeConfig);

const {HTTPError} = require('../errors/HTTPError');

const r = client.search({
  index: 'post',
  body: {
    query: {
      match: {"TITLE":"TITILE1"}
    }
  }
}, (err, result) => {
  if (err) throw new HTTPError(404,err, 4040010,'Resource not found.');
  if(result.statusCode === 200 && result.body.hits){
    console.log('------es result-2----',result.body.hits.hits);
  }
});



const bulk = client.index({
  index:'post',
  type:'xhs',
  refresh:'true',
  _source:'true',
  body:{
  }
})
// r.abort()

async function createOrUpdateContent(content){
  const {_id,__v,...post} = content;
  return await client.index({
    id: _id.toString(),
    index:'post',
    type:'xhs',
    body: post
  })
}

async function createOrUpdateContents(contents) {
  const ps = [];
  for (const content of contents) {
    const cToInsert = content.toObject && content.toObject();
    ps.push(createOrUpdateContent(cToInsert));
  }
  await Promise.all(ps);
}