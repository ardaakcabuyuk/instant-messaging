const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const data = require('./data');
const messageToObject = require('./utils/messages');
const { joinUser, getCurrentUser, leaveUser, getOnline } = require('./utils/users')
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const sessionMiddleware = session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
});
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.post('/login', async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var success = false;
    if (username && password) {
        for (var user of data.getUsers()) {
            if (user.username == username && user.password == password) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.room = req.body.group + '-' + req.body.channel;
                success = true;
                req.session.save(function (err) {
                    res.redirect('/chat');
                })
            }
        }
        if (!success) {
            res.send('Incorrect username or password!');
        }
    } else {
        res.send('Please enter Username and Password!');
    }
});

app.get('/chat', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname + '/public/chat.html'));
    } else {
        res.send('Please login to view this page!');
    }
});

//client connects
io.on('connection', socket => {
    console.log('New connection...');
    const user = joinUser(socket.id, socket.request.session.username, socket.request.session.room);
    socket.join(user.room);
    socket.broadcast
        .to(user.room)
        .emit('message', messageToObject('BOT', `${user.username} has joined to chat.`));
    socket.on('chat_message', (msg) => {
        io.to(user.room).emit('message', messageToObject(user.username, msg));
    });

    io.to(user.room).emit('online', {
        room: user.room,
        users: getOnline(user.room)
    });
    socket.on('disconnect', () => {
        const user = leaveUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', messageToObject('BOT', `${user.username} has left to chat.`));
            io.to(user.room).emit('online', {
                room: user.room,
                users: getOnline(user.room)
            });
        }
    })
    console.log(socket.request.session);
})
const PORT = process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));