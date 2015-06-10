process.stdin.setEncoding('utf8');
process.stdin.resume();

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port: 9000 });

process.stdin.on('data', function(data) {
  wss.clients.forEach(function each(client) {
    client.send(data, { binary: true });
  });
});
