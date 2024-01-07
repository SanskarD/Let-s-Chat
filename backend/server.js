const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const colors = require("colors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/message", messageRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("running port 3000".yellow.bold);
});

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors:{
        origin: process.env.SOCKET_ORIGIN
    }
})

io.on("connection",(socket)=>{
    console.log("connected to socket.io")

    socket.on('setup',(userData) =>{
        socket.join(userData._id)
        socket.emit("connected")
    })

    socket.on('join chat',(room)=>{
        socket.join(room)
        console.log("joined " + room);
    })

    socket.on("typing",(room)=>{
        socket.in(room).emit("typing",room)
    })
    socket.on("stop typing",(room)=>{
        socket.in(room).emit("stop typing")
    })

    socket.on("new message",(newMessage)=>{
        let chat = newMessage.chat
        if(!chat.users) return console.log("Chat users not found")

        
        chat.users.forEach(user => {
            if(user._id == newMessage.sender._id) return
            socket.in(user._id).emit("message recieved",newMessage)

        })
    })

    socket.off("setup",()=>{
        console.log("disconnected")
        socket.leave(userData._id)
    })

})
