define(['./log_source'], function(LogSource) {

  function WebSocketSource(url) {
    var self = this;
    self.webSocket = new WebSocket(url);
    self.webSocket.onmessage = function(e) {
      self.ondata(e.data);
    };
  };

  WebSocketSource.prototype = new LogSource;

  return WebSocketSource;
});
