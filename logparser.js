// Log lines look like this
// 06-04 09:00:16.261  1409  1409 D OpenGLRenderer: TextureCache::get:
var logPattern = /(.{18})\s*(\S+)\s*(\S+) (.) (\S+)\s*: (.*)/;
var tsPattern = /(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).(\d{3})/;
var outputNode;

var parseDate = function(timestamp) {
  var m = tsPattern.exec(timestamp);
  var d = new Date();
  d.setMonth(m[1] - 1);
  d.setDate(m[2]);
  d.setHours(m[3]);
  d.setMinutes(m[4]);
  d.setSeconds(m[5]);
  d.setMilliseconds(m[6]);
  return d.getTime();
}

var parseLine = function(line) {
  var match = logPattern.exec(line);
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
  }
}

var printLog = function(log) {
  return $.el.div({ 'class': 'log ' + log.level },
      $.el.span({ 'class': 'ts' }, new Date(log.timestamp).toLocaleTimeString()),
      $.el.span({ 'class': 'pid' }, log.pid),
      $.el.span({ 'class': 'tid' }, log.tid),
      $.el.span({ 'class': 'tag' }, log.tag),
      $.el.span({ 'class': 'msg' }, log.message)
    );
}

var onmessage = function(e) {
  var log = parseLine(e.data);
  var dom;
  if (typeof log == "string") {
    console.warn("couldn't parse line: " + log);
    dom = $.el.div({ 'class': 'log raw' }, log);
  } else {
    dom = printLog(log);
  }
  dom.appendTo(outputNode);
}

window.onload = function() {
  outputNode = document.getElementById('logcat');
  window.webSocket = new WebSocket("ws://localhost:9000");
  window.webSocket.onmessage = onmessage;
}

