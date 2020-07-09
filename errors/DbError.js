class DbError extends Error{
  constructor(statusCode, resMsg, errCode, msg){
    super(`Database Error: ${msg}`);
    this.statusCode = statusCode;
    this.resMsg = resMsg;
    this.errCode = errCode;
  }
}

module.exports = DbError;