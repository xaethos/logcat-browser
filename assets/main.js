require(["log_cat", "web_socket_source", "file_source"],
function( LogCat,    WebSocketSource,     FileSource) {

  function parseLogFile(e) {
    var files = e.target.files; // FileList object
    if (files.length == 0) return;

    var outputNode = document.getElementById('logcat');
    outputNode.innerHTML = '';

    window.logcat = new LogCat(new FileSource(files[0]),  outputNode)
  }

  window.logcat = new LogCat(
      new WebSocketSource("ws://localhost:9000"),
      document.getElementById('logcat'))
  document.getElementById('logfile').addEventListener('change', parseLogFile, false);
});
