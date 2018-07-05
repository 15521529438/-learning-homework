
'use strict';

/**
 * Module dependencies.
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var isGeneratorFunction = require('is-generator-function');
var debug = require('debug')('koa:application');
var onFinished = require('on-finished');
var response = require('./response');
var compose = require('koa-compose');
var isJSON = require('koa-is-json');
var context = require('./context');
var request = require('./request');
var statuses = require('statuses');
var Cookies = require('cookies');
var accepts = require('accepts');
var Emitter = require('events');
var assert = require('assert');
var Stream = require('stream');
var http = require('http');
var only = require('only');
var convert = require('koa-convert');
var deprecate = require('depd')('koa');

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

module.exports = function (_Emitter) {
  _inherits(Application, _Emitter);

  /**
   * Initialize a new `Application`.
   *
   * @api public
   */

  function Application() {
    _classCallCheck(this, Application);

    var _this = _possibleConstructorReturn(this, (Application.__proto__ || Object.getPrototypeOf(Application)).call(this));

    _this.proxy = false;
    _this.middleware = [];
    _this.subdomainOffset = 2;
    _this.env = process.env.NODE_ENV || 'development';
    _this.context = Object.create(context);
    _this.request = Object.create(request);
    _this.response = Object.create(response);
    return _this;
  }

  /**
   * Shorthand for:
   *
   *    http.createServer(app.callback()).listen(...)
   *
   * @param {Mixed} ...
   * @return {Server}
   * @api public
   */

  _createClass(Application, [{
    key: 'listen',
    value: function listen() {
      debug('listen');
      var server = http.createServer(this.callback());
      return server.listen.apply(server, arguments);
    }

    /**
     * Return JSON representation.
     * We only bother showing settings.
     *
     * @return {Object}
     * @api public
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {
      return only(this, ['subdomainOffset', 'proxy', 'env']);
    }

    /**
     * Inspect implementation.
     *
     * @return {Object}
     * @api public
     */

  }, {
    key: 'inspect',
    value: function inspect() {
      return this.toJSON();
    }

    /**
     * Use the given middleware `fn`.
     *
     * Old-style middleware will be converted.
     *
     * @param {Function} fn
     * @return {Application} self
     * @api public
     */

  }, {
    key: 'use',
    value: function use(fn) {
      if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
      if (isGeneratorFunction(fn)) {
        deprecate('Support for generators will be removed in v3. ' + 'See the documentation for examples of how to convert old middleware ' + 'https://github.com/koajs/koa/tree/v2.x#old-signature-middleware-v1x---deprecated');
        fn = convert(fn);
      }
      debug('use %s', fn._name || fn.name || '-');
      this.middleware.push(fn);
      return this;
    }

    /**
     * Return a request handler callback
     * for node's native http server.
     *
     * @return {Function}
     * @api public
     */

  }, {
    key: 'callback',
    value: function callback() {
      var _this2 = this;

      var fn = compose(this.middleware);

      if (!this.listeners('error').length) this.on('error', this.onerror);

      return function (req, res) {
        res.statusCode = 404;
        var ctx = _this2.createContext(req, res);
        var onerror = function onerror(err) {
          return ctx.onerror(err);
        };
        onFinished(res, onerror);
        fn(ctx).then(function () {
          return respond(ctx);
        }).catch(onerror);
      };
    }

    /**
     * Initialize a new context.
     *
     * @api private
     */

  }, {
    key: 'createContext',
    value: function createContext(req, res) {
      var context = Object.create(this.context);
      var request = context.request = Object.create(this.request);
      var response = context.response = Object.create(this.response);
      context.app = request.app = response.app = this;
      context.req = request.req = response.req = req;
      context.res = request.res = response.res = res;
      request.ctx = response.ctx = context;
      request.response = response;
      response.request = request;
      context.originalUrl = request.originalUrl = req.url;
      context.cookies = new Cookies(req, res, {
        keys: this.keys,
        secure: request.secure
      });
      request.ip = request.ips[0] || req.socket.remoteAddress || '';
      context.accept = request.accept = accepts(req);
      context.state = {};
      return context;
    }

    /**
     * Default error handler.
     *
     * @param {Error} err
     * @api private
     */

  }, {
    key: 'onerror',
    value: function onerror(err) {
      assert(err instanceof Error, 'non-error thrown: ' + err);

      if (404 == err.status || err.expose) return;
      if (this.silent) return;

      var msg = err.stack || err.toString();
      console.error();
      console.error(msg.replace(/^/gm, '  '));
      console.error();
    }
  }]);

  return Application;
}(Emitter);

/**
 * Response helper.
 */

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  var res = ctx.res;
  if (!ctx.writable) return;

  var body = ctx.body;
  var code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ('HEAD' == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    body = ctx.message || String(code);
    if (!res.headersSent) {
      ctx.type = 'text';
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ('string' == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}