const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const ENV_VARS = require('./config/envVars');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { protect } = require('./middleware/authMiddleware');
const { roleAuthorization } = require('./middleware/roleMiddleware');

connectDB();
dotenv.config();

console.log("MONGODB_URI:",process.env.MONGODB_URI);

const app = express();

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
      origin: '*', // Update with your frontend domain in production
      methods: ['GET', 'POST'],
    },
  });
  
  // Middleware
  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  
  // Routes
  app.use('/api', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/chat', chatRoutes);
  
  // Error Handling Middleware
  app.use(errorHandler);
  
  // Socket.IO Configuration
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.query.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const User = require('./models/user');
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return next(new Error('Authentication error'));
      }
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });
  
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.user.email}`);
  
    // Join project-specific room
    socket.on('joinProject', (projectId) => {
      socket.join(projectId);
      console.log(`${socket.user.email} joined project ${projectId}`);
    });
  
    // Handle chat messages
    socket.on('chatMessage', (data) => {
      const { projectId, message } = data;
      // Broadcast message to the project room
      io.to(projectId).emit('message', {
        sender: socket.user.email,
        message,
        timestamp: new Date(),
      });
      // Optionally, save the message to the database
      const ChatMessage = require('./models/chatMessage ');
      ChatMessage.create({
        projectId,
        sender: socket.user._id,
        message,
      });
    });
  
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.user.email}`);
    });
  });
  

const PORT = process.env.PORT;
server.listen(PORT,()=>{
    console.log(`sever is running on ${PORT}`);
    
})