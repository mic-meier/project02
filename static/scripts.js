document.addEventListener('DOMContentLoaded', () => {

    // Set variables for modal button and input
    const modalButton = document.getElementById('myModalButton');
    const modalInput = document.getElementById('myModalInput');

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
            $('#myModalInput').val('');
            modalButton.disabled = true;
        }
    });

    // Load channels
    socket.on('load channels', data => {
        let i;
        for (i = 0; i < data['channelsList'].length; i++) {
            let channel = data['channelsList'][i];
            let rooms = data['rooms'];
            update_channels(channel, rooms, socket);
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
        update_channels(channel, rooms, socket);
    });

    // User joined room
    socket.on('joined room', data => {
        let message = data.message;
        show_message(message);
    });

    // Define Modal behaviour
    modalInput.addEventListener('keyup', function (event) {
        if (this.value.length > 0) {
            modalButton.disabled = false;
            if (event.key === 'Enter') {
                modalButton.click();
            }
        }
        else {
            modalButton.disabled = true;
        }
    });
    modalButton.addEventListener('click', function () {
        submit(socket);
    });

    // Create new channel
    $('#newChannel').on('click', () => {
        // Define modal
        $('#myModal').modal('toggle');
        $('#myModalTitle').text('New Channel');
        $('#myModalLabel').text('Please enter a name for your channel:');
        $('#myModalInput').val('');
        modalButton.disabled = true;
    });

    $('#userName').text(localStorage.getItem('username'));
});

// Function definitions
function update_channels(channel, rooms, socket) {
    // Define list item
    const li = document.createElement('li');
    li.setAttribute('class', 'nav-item');
    // Define anchor tag and append to list item
    const a = document.createElement('a');
    a.setAttribute('href', '#');
    a.setAttribute('class', 'nav-link channel');
    a.setAttribute('onclick', 'return false');
    a.setAttribute('id', channel);
    // Adding onclick event to generated element
    a.addEventListener('click', () => {
        click_channel(channel, rooms, socket)
    });
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
}

function show_channel(channel, rooms) {
        // Create div to hold the messages and insert into DOM
        const messageDiv = document.createElement('div');
        messageDiv.id = 'messages';
        $('#messages').replaceWith(messageDiv);
        // Get at each individual message
        let i = 0;
        for (i; i < rooms[channel].length; i++) {
           show_message(rooms[channel][i]);
        }
        return false;
}

function click_channel(channel, rooms, socket) {
    const username = localStorage.getItem('username');
    show_channel(channel, rooms, socket);
    socket.emit('join room', {'username': username, 'channel': channel});
    return false;
}

function show_message(message) {
    const p = document.createElement('p');
    p.innerHTML = message;
    $('#messages').append(p);
}

// Define modal behaviour when form is submitted
function submit(socket) {
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
}