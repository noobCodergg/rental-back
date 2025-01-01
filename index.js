const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./Db/db");
const authRoutes=require('./Route/AuthRoutes')
const postRoutes=require('./Route/PostRoutes')
const userRoutes=require('./Route/UserRoutes')
const chatRoutes=require('./Route/ChatRoutes')
const applicationRoutes=require('./Route/ApplicationRoute')
const subscriptionRoutes=require('./Route/SubscriptionRoute')
const rideRoutes=require('./Route/RideRoutes')
const adminRoutes=require('./Route/AdminRoutes')
require("dotenv").config();
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");


connectDB();

const app = express();
const httpServer = createServer(app);

app.use(bodyParser.json({ limit: "1000mb" })); 
app.use(bodyParser.urlencoded({ limit: "1000mb", extended: true }));

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
 

 
  socket.on("join", (roomId) => {
    console.log(`User joined room: ${roomId}`);
    socket.join(roomId); // Join the specified room
  });


  socket.on("privateMsg", (data) => {
    const { content, sender, receiver } = data;
    const roomId = [sender, receiver].sort().join("-"); 

    console.log(`Message from ${sender} to ${receiver} in room ${roomId}: ${content}`);

    
    io.to(roomId).emit("newMsg", { content, sender });
  });


  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use('/api/auth',authRoutes)
app.use('/api/post',postRoutes)
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/application',applicationRoutes)
app.use('/api/subscription',subscriptionRoutes)
app.use('/api/ride',rideRoutes)
app.use('/api/admin',adminRoutes)

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
