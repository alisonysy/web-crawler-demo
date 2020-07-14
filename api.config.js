const db = {
  url:'mongodb://localhost/nodejs'
}

const esNodeConfig = {
  node:'http://localhost:9200',
  maxRetries:3,
  requestTimeout:10000
}

const fetchingConfig = {
  max:300,
  postNumberPerPage:25,
}

module.exports = {
  db,
  esNodeConfig,
  fetchingConfig
}