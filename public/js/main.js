const chatForm = document.getElementById('chat-form');
const messages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();

socket.on('online', ({room, users}) => {
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  //scroll down
  messages.scrollTop = messages.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit('chat_message', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

})

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta"> ${message.user} <span>${message.time}</span></p><p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join()}`;
}