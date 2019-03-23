/* incluindo o static server */

var static = require('node-static');

var http = require('http');

var port = process.env.PORT;
var directory = __dirname + '/public';

if(typeof port == 'undefined' || !port){
  directory = './public';
  port = 8080;
}

var file = new static.Server(directory);

var app = http.createServer(
    function (request, response) {
      request.addListener('end',
        function (){
          file.serve(request,response);
        }
      ).resume();
    }
  ).listen(port);

console.log('Server ON');

/* websocket */

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket){
  function log(){
    var array = ['*** Log do Servidor: '];
    for(var i = 0; i < arguments.length; i++){
      array.push(arguments[i]);
      console.log(arguments[i]);
    }
    socket.emit('log', array);
    socket.broadcast.emit('log', array);
  }
    log('Um usuario conectou ao server');

    socket.on('disconnect', function(socket){
    log('Um usuario desconectou do server');
    });
});
