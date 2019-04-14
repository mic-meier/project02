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
            update_channels(channel);
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
        update_channels(channel);
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
        // $('#myModal').modal({backdrop: 'static', keyboard: false});
            $('#myModalTitle').text('New Channel');
            $('#myModalLabel').text('Please enter a name for your channel:');
            $('#myModalButton').text('Submit');
            $('#myModalInput').val('');
    });

    $('#userName').text(localStorage.getItem('username'));
});

// Function definitions
function update_channels(data) {
    const li = document.createElement('li');
    li.innerHTML = data;
    $('#channels').append(li);
}