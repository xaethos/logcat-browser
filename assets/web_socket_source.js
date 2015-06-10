define(['./log_source'], function(LogSource) {

  function WebSocketSource(url) {
    var self = this;

    self.webSocket = new WebSocket(url);
    self.webSocket.binaryType = 'arraybuffer';
    self.webSocket.onmessage = function(e) {
      console.log('byte count', e.data.byteLength);
      self.ondata(e.data);
    };
  }

  WebSocketSource.prototype = new LogSource();

  return WebSocketSource;
});
