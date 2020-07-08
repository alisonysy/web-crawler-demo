class HTTPError extends Error{
  constructor(statusCode, resMsg, errCode, msg){
    super(`HTTP Error: ${msg}`);
    this.statusCode = statusCode;
    this.resMsg = resMsg;
    this.errCode = errCode;
  }
}

module.exports = HTTPError;