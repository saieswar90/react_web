const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mqtt = require('mqtt');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// MQTT Configuration
const mqttOptions = {
  host: 'mqtt.platinumrobotics.com',
  port: 1883,
  username: 'mqtt_user',
  password: '8655167646',
  clientId: 'web-client-' + Math.random().toString(16).substr(2, 8)
};

// Connect to MQTT broker
const mqttClient = mqtt.connect(mqttOptions);

// MQTT Topics
const CONTROL_TOPIC = 'home/device1/control';
const STATUS_TOPIC = 'home/device1/status';

// MQTT Connection handling
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Subscribe to status topic
  mqttClient.subscribe(STATUS_TOPIC, (err) => {
    if (!err) {
      console.log(`Subscribed to ${STATUS_TOPIC}`);
    }
  });
});

// Handle MQTT messages
mqttClient.on('message', (topic, message) => {
  if (topic === STATUS_TOPIC) {
    // Broadcast status update to all connected clients
    io.emit('statusUpdate', message.toString());
    console.log(`Status update: ${message.toString()}`);
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle control commands from client
  socket.on('controlDevice', (command) => {
    console.log(`Received control command: ${command}`);
    mqttClient.publish(CONTROL_TOPIC, command);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Middleware
app.use(cors());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
