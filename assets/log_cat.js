define(['lib/laconic'], function(el) {

  function LogCat(source, outputNode) {
    var self = this;

    self.parseDate = function(timestamp) {
      var m = self.PATTERN_TS.exec(timestamp);
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
      var match = self.PATTERN_LOG.exec(line);
      if (!match) { return line; }

      var timestamp = self.parseDate(match[1]);

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
      return el.div({ 'class': 'log ' + log.level },
          el.span({ 'class': 'ts' }, new Date(log.timestamp).toLocaleTimeString()),
          el.span({ 'class': 'pid' }, log.pid),
          el.span({ 'class': 'tid' }, log.tid),
          el.span({ 'class': 'tag' }, log.tag),
          el.span({ 'class': 'msg' }, log.message)
        );
    };

    source.ondata = function(line) {
      if (!line) return;

      var log = self.parseLine(line);
      var dom;
      if (typeof log == "string") {
        dom = el.div({ 'class': 'log raw' }, log);
      } else {
        dom = self.printLog(log);
      }
      dom.appendTo(outputNode);
    };
  };
  // Log lines look like this
  // 06-04 09:00:16.261  1409  1409 D OpenGLRenderer: TextureCache::get:
  LogCat.prototype.PATTERN_LOG = /(.{18})\s*(\S+)\s*(\S+) (.) (\S*)\s*: (.*)/;
  LogCat.prototype.PATTERN_TS = /(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).(\d{3})/;
  return LogCat;
});
