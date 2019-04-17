document.addEventListener('DOMContentLoaded', () => {

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {
        // TODO: When channel clicked
        // TODO: When button to create new channel clicked
        // TODO: Message Input
        if(!localStorage.getItem('username')) {
            $('#myModal').modal({backdrop: 'static', keyboard: false});
            $('#myModalTitle').text('Register');
            $('#myModalLabel').text('Please enter a user name:');
            $('#myModalButton').text('Submit');
            $('#myModalInput').val('');
        }
    });

    // Load channels
    socket.on('load channels', data => {
        let i;
        for (i = 0; i < data['channelsList'].length; i++) {
            let channel = data['channelsList'][i];
            let rooms = data['rooms'];
            update_channels(channel, rooms);
            show_channel(channel, rooms);
        }
    });

    // New user registered
    socket.on('user registered', data => {
        // TODO: Error handling
        localStorage.setItem('username', data.username);
        $('#userName').text(localStorage.getItem('username'));
    });

    // Update channel list after creating a new channel
    socket.on('add channel', data => {
        let channel = data.addNewChannel;
        let rooms = data.rooms;
        update_channels(channel, rooms);
    });

    // Define behaviour of modal button
    $('#myModalButton').on('click', () => {
        // Behaviour when no user name in local storage
        if(!localStorage.getItem('username')) {
            let username = $('#myModalInput').val();
            socket.emit('new user', {'username': username});
            $('#myModal').modal('hide');
        }
        else {
            let newChannel = $('#myModalInput').val();
            socket.emit('add channel', {'newChannel': newChannel});
            $('#myModal').modal('hide');
        }
    });

    // Create new channel
    $('#newChannel').on('click', () => {
        // Define modal
        $('#myModal').modal('toggle');
        $('#myModalTitle').text('New Channel');
        $('#myModalLabel').text('Please enter a name for your channel:');
        $('#myModalButton').text('Submit');
        $('#myModalInput').val('');
    });

    $('#userName').text(localStorage.getItem('username'));
});

// Function definitions
function update_channels(channel, rooms) {
    // Define list item
    const li = document.createElement('li');
    li.setAttribute('class', 'nav-item');
    // Define anchor tag and append to list item
    const a = document.createElement('a');
    a.setAttribute('href', '#');
    a.setAttribute('class', 'nav-link channel');
    a.setAttribute('onclick', 'return false');
    a.setAttribute('id', channel);
    li.appendChild(a);
    // Define i tag and append to anchor element
    const i = document.createElement('i');
    i.setAttribute( 'class', 'material-icons icon');
    i.innerHTML = 'chat';
    a.appendChild(i);
    // Define span tag and append to anchor element
    const span = document.createElement('span');
    span.setAttribute('class', 'text');
    span.innerHTML = channel;
    a.appendChild(span);
    $('#channels').append(li);
    // Adding onclick event to generated element
    li.onclick = click_channel(channel, rooms);
}

function show_channel(channel, rooms) {
    document.getElementById(channel).onclick = function() {
        // Create div to hold the messages and insert into DOM
        const messageDiv = document.createElement('div');
        messageDiv.id = 'messages';
        $('#messages').replaceWitbashh(messageDiv);
        // Get at each individual message
        let i = 0;
        for (i; i < rooms[channel].length; i++) {
           show_message(rooms[channel][i]);
        }
        return false;
    }
}

function click_channel(channel, rooms) {
    show_channel(channel, rooms);
    return false;
}

function show_message(message) {
    const p = document.createElement('p');
    p.innerHTML = message;
    $('#messages').append(p);
}