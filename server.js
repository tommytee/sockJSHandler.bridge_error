var Router = require("vertx-web-js/router");
var SockJSHandler = require("vertx-web-js/sock_js_handler");

var router = Router.router(vertx);

// Let through any messages sent to 'demo.orderMgr' from the client
var inboundPermitted = {
  "address" : "demo.someService"
};

var sockJSHandler = SockJSHandler.create(vertx);
var options = {
  "inboundPermitteds" : [
    inboundPermitted
  ]
};

sockJSHandler.bridge(options, function (be) {

  if (be.type() === 'PUBLISH' || be.type() === 'RECEIVE') {
    if (be.getRawMessage().body === "armadillos") {
      // Reject it
      be.complete(false);
      return
    }
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
