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

    socket.on('join_room', function(payload){
    log('Servidor recebeu um comando','join_room', payload);
    if('undefined' == typeof payload || !payload){
      var error_message = 'join_room não carregado, comando abortado';
      log(error_message);
      socket.emit('join_room_response', {
                                          result:'fail',
                                          message: error_message
                                        });
          return;
      }
      var room = payload.room;
      if('undefined' == typeof room || !room){
        var error_message = 'join_room não foi carregado, comando abortado.';
        log(error_message);
        socket.emit('join_room_response', {
                                            result:'fail',
                                            message: error_message
                                          });
            return;
      }
      var username = payload.username;
      if('undefined' == typeof username || !username){
        var error_message = 'join_room não carregou o username, comando abortado';
        log(error_message);
        socket.emit('join_room_response', {
                                            result:'fail',
                                            message: error_message
                                          });
            return;
      }
      socket.join(room);

      var roomObject = io.sockets.adapter.rooms[room];
      if('undefined' == typeof roomObject || !roomObject){
        var error_message = 'join_room não criou a sala, comando abortado';
        log(error_message);
        socket.emit('join_room_response', {
                                            result:'fail',
                                            message: error_message
                                          });
            return;
      }

      var numClients = roomObject.length;
      var success_data = {
        result: 'success',
        room: room,
        username: username,
        membership: (numClients + 1)
      };
    io.sockets.in(room).emit('join_room_response', success_data);
    log(room+' entrou o usuario :'+username);
  });

/**/
  socket.on('send_message', function(payload){
  log('Servidor recebeu um comando','send_message', payload);
  if('undefined' == typeof payload || !payload){
    var error_message = 'send_message não carregado, comando abortado';
    log(error_message);
    socket.emit('send_message_response', {
                                        result:'fail',
                                        message: error_message
                                      });
        return;
    }
    var room = payload.room;
    if('undefined' == typeof room || !room){
      var error_message = 'send_message não foi carregado, comando abortado.';
      log(error_message);
      socket.emit('send_message_response', {
                                          result:'fail',
                                          message: error_message
                                        });
          return;
    }
    var username = payload.username;
    if('undefined' == typeof username || !username){
      var error_message = 'send_message não carregou o username, comando abortado';
      log(error_message);
      socket.emit('send_message_response', {
                                          result:'fail',
                                          message: error_message
                                        });
          return;
    }
    var message = payload.message;
    if('undefined' == typeof message || !message){
      var error_message = 'send_message não carregou a mensagem, comando abortado';
      log(error_message);
      socket.emit('send_message_response', {
                                          result:'fail',
                                          message: error_message
                                        });
          return;
    }

    var success_data = {
            result:'success',
            room: 'room',
            username: 'username',
            message: message
    };

    io.sockets.in(room).emit('send_message_response', success_data);
    log('Mensagem enviada para '+room+' por'+username);
});

});
