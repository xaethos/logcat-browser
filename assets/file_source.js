define(['./log_source'], function(LogSource) {

  function FileSource(file) {
    var self = this;
  };

  FileSource.prototype = new LogSource;

  return FileSource;
});
