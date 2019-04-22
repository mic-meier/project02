import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

usernames = []
usersDict = {}
channelsList = ["General", "Test channel"]
# TODO: Remove manually added channels after testing
rooms = {"General": ['General channel message 1'], "Test channel": ["Test channel message 1", "Test message 2"]}


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("connect")
def connect():
    emit("load channels", {"rooms": rooms, "channelsList": channelsList})


@socketio.on("new user")
def new_user(data):
    username = data["username"]
    if username not in usernames:
        usernames.append(username)
        usersDict[username] = request.sid
        emit("user registered", {"username": username})
    elif username in usernames:
        # TODO: handle username that already exists
        pass


@socketio.on('add channel')
def add_channel(data):
    if data["newChannel"] in channelsList:
        # TODO: Error handling
        pass
    else:
        channelsList.append(data["newChannel"])
        rooms[data["newChannel"]] = []
        emit("add channel", {"addNewChannel": data["newChannel"], "rooms": rooms}, broadcast=True)


@socketio.on('join room')
def join__a_room(data):
    room = data["channel"]
    username = data["username"]
    join_room(room)
    print('call received')
    emit("joined room", {"message": f'{username} has joined the room.'}, room=room, broadcast=True)
    print('message emitted')


if __name__ == '__main__':
    socketio.run(app)
