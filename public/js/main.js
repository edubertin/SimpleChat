function getURLParameters(whichParam){
  var pageURL = window.location.search.substring(1);
  var pageURLVariables = pageURL.split('&');

  for(var i = 0; i < pageURLVariables.length; i++){
    var parameterName = pageURLVariables[i].split('=');
    if (parameterName[0] == whichParam){
      return parameterName[1];
    }
  }
}
var username = getURLParameters('username');
if('undefined' == typeof username || !username){
  username = 'Anonimo_'+Math.random();
}

var chat_room = 'Sala 1';

/* $('#messages').append('<h4>'+username+'</h4>'); */

/* Conectando o server de Socket */

var socket = io.connect();

socket.on('log', function(array){
  console.log.apply(console.array);
});

socket.on('join_room_response', function(payload){
  if (payload.result == 'fail'){
    alert(payload.message);
    return;
  }
  $('#messages').append('<p>'+username+' entrou no chat.</p>');
});


socket.on('send_message_response', function(payload){
  if (payload.result == 'fail'){
    alert(payload.message);
    return;
  }
  $('#messages').append('<p><b>'+username+' disse: </b>'+payload.message+'</p>');
});



function send_message(){
    var payload = {};
    payload.room = chat_room;
    payload.username = username;
    payload.message = $('#send_message_holder').val();
    console.log('*** Client Log Message: \'send_message\' payload: '+JSON.stringify(payload));
    socket.emit('send_message', payload);

}

$(function(){
  var payload = {};
  payload.room = chat_room;
  payload.username = username;

  console.log('*** Log do Cliente: \'join_room\' payload: '+JSON.stringify(payload));
  socket.emit('join_room', payload);
});
