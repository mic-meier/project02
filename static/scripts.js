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
            let room = data['channels'];
            let channel = data['channelsList'][i];
            update_channels(channel, room);
            show_channel(channel, room);
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
        let channel = data.channel;
        let channels = data.channels;
        update_channels(channel, channels);
    });

    // Define behaviour of modal button
    $('#myModalButton').on('click', () => {
        // Behaviour when no user name in local storage
        if(!localStorage.getItem('username')) {
            var username = $('#myModalInput').val();
            socket.emit('new user', {'username': username});
            $('#myModal').modal('hide');
        }
        else {
            var channel = $('#myModalInput').val();
            socket.emit('add channel', {'channel': channel});
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
function update_channels(channel, channels) {
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
    li.onclick = click_channel(channel, channels);
}

function show_channel(channel, channels) {
    document.getElementById(channel).onclick = function() {

        console.log(channel);
        console.log(channels[channel][0]);
        return false;
    }
}

function click_channel(channel, channels) {
    show_channel(channel, channels);
    return false;
}