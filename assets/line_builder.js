define(function() {

  function LineBuilder() {
    var self = this;

    var text = "";
    var decoder = new TextDecoder('utf-8');

    function emitLines() {
      var lines = text.split("\n");
      text = lines.pop();

      lines.forEach(function(line) {
        self.online(line);
      });
    }

    self.append = function(arrayBuff) {
      text += decoder.decode(arrayBuff, { 'stream': true });
      emitLines();
    };

    self.close = function() {
      text += decoder.decode(new ArrayBuffer(), { 'stream': false });
      emitLines();

      if (text.length > 0) {
        self.online(text);
        text = "";
      }
    };
  }

  LineBuilder.prototype.online = function() {};

  return LineBuilder;
});
