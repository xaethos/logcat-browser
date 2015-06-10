define(['line_builder'], function(LineBuilder) {
  function LogSource() {
    var self = this;

    var lineHandler;
    self.setListener = function(handler) {
      lineHandler = handler;
    };

    self.lineBuilder = new LineBuilder();
    self.lineBuilder.online = function(line) {
      if (lineHandler) lineHandler(line);
    };

    self.ondata = function(arrayBuff) {
      self.lineBuilder.append(arrayBuff);
    };
  }

  return LogSource;
});
