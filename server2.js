var Router = require("vertx-web-js/router");
var SockJSHandler = require("vertx-web-js/sock_js_handler");

var router = Router.router(vertx);

// Let through any messages sent to 'demo.orderService' from the client
var inboundPermitted = {
  "address" : "demo.orderService"
};

var sockJSHandler = SockJSHandler.create(vertx);
var options = {
  "inboundPermitteds" : [
    inboundPermitted
  ]
};

sockJSHandler.bridge(options, function (be) {
  if (be.type() === 'PUBLISH' || be.type() === 'SEND') {
    // Add some headers
    var headers = {
      "header1" : "val",
      "header2" : "val2"
    };
    var rawMessage = be.getRawMessage();
    rawMessage.headers = headers;
    be.setRawMessage(rawMessage);
  }
  be.complete(true);
});

router.route("/eventbus/*").handler(sockJSHandler.handle);

/**
 * added
 */
var StaticHandler = require("vertx-web-js/static_handler");

router.route().handler(StaticHandler.create().handle);

vertx.createHttpServer().requestHandler(router.accept).listen(8090);

