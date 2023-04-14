import { Manager, Socket } from 'socket.io-client'


let socket: Socket;

export const connectToServer = (jwtToken: string)=> {

  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js',{
    extraHeaders:{
      authentication: jwtToken
    }
  });

  socket?.removeAllListeners();

  socket = manager.socket('/');

  eventListener()

}


const eventListener = ()=>{

  const body = document.querySelector('body')!;
  const conectionStatus = document.querySelector('#conection-status')!;
  const clientsUl = document.querySelector('#clients-ul')!;
  const messageForm = document.querySelector('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

  socket.on('disconnect', () => {
    body.style.backgroundColor = '#800000';
    conectionStatus.innerHTML = 'Disconnected';
  })
  
  socket.on('connect', () => {
    body.style.backgroundColor = '#2F4F4F';
    conectionStatus.innerHTML = 'OnLine'
  })

  socket.on('clients-update', ( clients: string[] ) =>{
    let clientHTML='';

    clients.forEach( ( clientId: string ) => {
      clientHTML += `<li>${clientId}</li>`;
    })

    clientsUl.innerHTML = clientHTML;
  })

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (messageInput.value.trim().length <= 0 ) return;
  
    socket.emit('message-client', { 
      id: socket.id, 
      message: messageInput.value
    });

    messageInput.value='';
  })

  socket.on('message-server', (payload: {fullName: string, message: string })=>{
    let messages =  `
    <li>
      <strong>${payload.fullName}</strong>
      <span>${payload.message}</span>
    </li>
    `
    const li = document.createElement('li');
    li.innerHTML = messages;
    messagesUl.append(li)

  })

}  