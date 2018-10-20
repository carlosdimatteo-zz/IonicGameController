let socket = io('http://localhost:3001');

function $(id) {
    return document.getElementById(id);
}
socket.on('connected', () => {
    let li = document.createElement('li');
    li.innerHTML = socket.id;
    $('div').appendChild(li);
    socket.emit('identify', {
        type: 'game'
    });
});
socket.on('press', (object) => {
    keyPress(object)
});

socket.on('release', (object) => {
    keyRelease(object)
});

socket.on('chat message', function (msg) {
    let li = document.createElement('li');
    li.innerHTML = `${msg.username} envio ${msg.msg}`;
    $('div').appendChild(li);
});

function send() {
    socket.emit('chat message', {
        username: $('user').value.trim() === '' ? 'Anonimo' : $('user').value,
        msg: $('inp').value
    });
}
$('button').addEventListener('click', send);
window.onunload = () => {
    socket.emit('disconnected', 'game');
}