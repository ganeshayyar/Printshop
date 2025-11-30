require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const routes = require('./routes');
const queueManager = require('./services/queueManager');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1', routes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', socket => {
  console.log('Socket connected', socket.id);
  socket.on('disconnect', ()=>{});
});

queueManager.init(io);

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/printshop';
mongoose.connect(MONGO).then(()=>{
  const port = process.env.PORT || 4000;
  server.listen(port, ()=>console.log('Backend listening on', port));
}).catch(err=>{
  console.error('Mongo connection error', err);
  process.exit(1);
});
