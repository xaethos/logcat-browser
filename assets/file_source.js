define(['log_source', 'line_builder'], function(LogSource, LineBuilder) {

  function FileSource(file) {
    var self = this;

    var bufferSize = 1024;
    var fileLength = file.size;
    var readPos = 0;

    var lineBuilder = new LineBuilder();
    lineBuilder.online = function(line) {
      self.ondata(line);
    };

    var reader = new FileReader();
    reader.onload = function () {
      lineBuilder.append(reader.result);
      read();
    }
    reader.onerror = function () {
      throw reader.error;
    };

    function hasMoreData() {
      return readPos <= fileLength;
    }

    function read() {
      if (hasMoreData()) {
        var blob = file.slice(readPos, readPos + bufferSize);
        readPos += bufferSize;
        reader.readAsArrayBuffer(blob);
      } else {
        lineBuilder.close();
      }
    }
    self.read = read;
  }

  FileSource.prototype = new LogSource;

  return FileSource;
});
