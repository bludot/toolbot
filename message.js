var Parser = require('./parser');
var codes = require('./codes');


/**
 * parse the codes to messages
 * @param  {[type]} crlfstring [description]
 * @return {[type]}            [description]
 */
module.exports = function(crlfstring) {
  this.message  = Parser.parse(crlfstring);
  this._crlfstr = crlfstring;

  this._hasPrefix = function() {
    return typeof this.message.prefix !== 'undefined';
  }

  this._hasParams = function() {
    return typeof this.message.params !== 'undefined';
  }
  this.toString = function() {
    return this._crlfstr;
  }
  this.prefix = function() {
    return (this._hasPrefix()) ?
      `:${this.message.prefix['nickname']}!${this.message.prefix['user']}@${this.message.prefix['host']}`
      : undefined;
  }
  this.servername = function() {
    return (this._hasPrefix()) ? this.message.prefix['servername'] : undefined;
  }
  this.nickname = function() {
    return (this._hasPrefix()) ? this.message.prefix['nickname'] : undefined;
  }
  this.user = function() {
    return (this._hasPrefix()) ? this.message.prefix['user'] : undefined;
  }
  this.host = function() {
    return (this._hasPrefix()) ? this.message.prefix['host'] : undefined;
  }
  this.command = function() {
    return (codes[this.message.command] ? codes[this.message.command].name : this.message.command);
  }
  this.params = function() {
    return (this._hasParams()) ? this.message.params[0] : undefined;
  }
  this.args = function() {
    return (this._hasParams()) ? this.message.params[0] : undefined;
  }
  this.trailing = function() {
    return (this._hasParams()) ? this.message.params[1] : undefined;
  }
  return this;
}
