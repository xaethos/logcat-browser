function LogSource() {}
LogSource.prototype.ondata = function(e) {};

function WebSocketSource(url) {
  var self = this;
  self.webSocket = new WebSocket(url);
  self.webSocket.onmessage = function(e) {
    self.ondata(e);
  };
};
WebSocketSource.prototype = new LogSource;
window.WebSocketSource = WebSocketSource;

function FileSource(file) {
  var self = this;
};
FileSource.prototype = new LogSource;
window.FileSource = FileSource;

function LogCat(source, outputNode) {
  var self = this;

  self.parseDate = function(timestamp) {
    var m = this.PATTERN_TS.exec(timestamp);
    var d = new Date();
    d.setMonth(m[1] - 1);
    d.setDate(m[2]);
    d.setHours(m[3]);
    d.setMinutes(m[4]);
    d.setSeconds(m[5]);
    d.setMilliseconds(m[6]);
    return d.getTime();
  };

  self.parseLine = function(line) {
    var match = this.PATTERN_LOG.exec(line);
    if (!match) { return line; }

    var timestamp = parseDate(match[1]);

    var level;
    switch (match[4]) {
      case 'E':
        level = 'error';
        break;
      case 'W':
        level = 'warn';
        break;
      case 'I':
        level = 'info';
        break;
      case 'D':
        level = 'debug';
        break;
      case 'V':
        level = 'verbose';
        break;
      default:
        level = 'unknown'
    }

    return {
      'timestamp': timestamp,
      'pid': match[2],
      'tid': match[3],
      'level': level,
      'tag': match[5],
      'message': match[6]
    };
  };

  self.printLog = function(log) {
    return $.el.div({ 'class': 'log ' + log.level },
        $.el.span({ 'class': 'ts' }, new Date(log.timestamp).toLocaleTimeString()),
        $.el.span({ 'class': 'pid' }, log.pid),
        $.el.span({ 'class': 'tid' }, log.tid),
        $.el.span({ 'class': 'tag' }, log.tag),
        $.el.span({ 'class': 'msg' }, log.message)
      );
  };

  source.ondata = function(e) {
    var log = self.parseLine(e.data);
    var dom;
    if (typeof log == "string") {
      console.warn("couldn't parse line: " + log);
      dom = $.el.div({ 'class': 'log raw' }, log);
    } else {
      dom = printLog(log);
    }
    dom.appendTo(outputNode);
  };
};
// Log lines look like this
// 06-04 09:00:16.261  1409  1409 D OpenGLRenderer: TextureCache::get:
LogCat.prototype.PATTERN_LOG = /(.{18})\s*(\S+)\s*(\S+) (.) (\S*)\s*: (.*)/;
LogCat.prototype.PATTERN_TS = /(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).(\d{3})/;
window.LogCat = LogCat;

function parseLogFile(e) {
  var files = e.target.files; // FileList object
  if (files.length == 0) return;

  var outputNode = document.getElementById('logcat');
  outputNode.innerHTML = '';

  window.logcat = new LogCat(new FileSource(files[0]),  outputNode)
}

window.onload = function() {
  window.logcat = new LogCat(
      new WebSocketSource("ws://localhost:9000"),
      document.getElementById('logcat'))
  document.getElementById('logfile').addEventListener('change', parseLogFile, false);
};
