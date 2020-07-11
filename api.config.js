const db = {
  url:'mongodb://localhost/nodejs'
}

const esNodeConfig = {
  node:'http://localhost:9200',
  maxRetries:3,
  requestTimeout:10000
}

const fetchingConfig = {
  max:300
}

module.exports = {
  db,
  esNodeConfig,
  fetchingConfig
}