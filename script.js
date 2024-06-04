const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const typingIndicator = document.getElementById('typing-indicator'); 
const name = prompt('What is your name?');
var typing = false;
var timeout = undefined;

socket.emit('new-user', name);

socket.on('chat-message', data => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', name => {
  appendMessage(`${name} connected`);
});

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`);
});

socket.on('typing', name => {
  showTypingIndicator(name);
});

socket.on('stopTyping', name => {
  hideTypingIndicator(name);
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit('send-chat-message', message);
  socket.emit('stop-typing', name);
  messageInput.value = '';
});

messageInput.addEventListener('input', () => {
  if (!typing) {
    typing = true;
    socket.emit('typing', name);
  }
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    typing = false;
    socket.emit('stop-typing', name);
  }, 2000);
});

function showTypingIndicator(name) {
  typingIndicator.innerText = `${name} is typing...`;
  typingIndicator.style.display = 'block';
}

function hideTypingIndicator(name) {
  typingIndicator.innerText = '';
  typingIndicator.style.display = 'none';
}

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
