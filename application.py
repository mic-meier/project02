import os

from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

usernames = []
usersDict = {}
channelsList = ["General"]
# TODO: Remove manually added channels after testing
channels = {"General": ['Test message 1'], "Test channel": ["Test message 1", "Test message 2"]}


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("connect")
def connect():
    emit("load channels", {"channels": channels})


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
    if data["channel"] in channelsList:
        # TODO: Error handling
        pass
    else:
        channelsList.append(data["channel"])
        channels[data["channel"]] = []
        print(channels)
        emit("add channel", {"channel": data["channel"]})


if __name__ == '__main__':
    socketio.run(app)
