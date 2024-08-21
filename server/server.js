const app = require("./app");
const dotenv = require("dotenv");
const connectToMongo = require("./config/db");

// Handling Uncaught Exceptions

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to Uncaught Exception");

    process.exit(1);
})

if (process.env.NODE_ENV !== "PRODUCTION") {
    dotenv.config({ path: "server/config/config.env" });
}

connectToMongo(); // Connecting to MongoDB Database

const server = app.listen(5000, () => {
    console.log(`Server running at http://localhost:5000`)
})

// Socket IO functions implementation

const socketIo = require("socket.io");

const io = socketIo(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }       
})

const onConnection = (socket) => {
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        socket.emit("connected");
    })

    socket.on("join chat", ({ room, currentRoom }) => {
        if (currentRoom) {
            socket.leave(currentRoom);
        }
        
        socket.join(room);
        // console.log("User joined room: " + room);
    })

    socket.on("typing", ({ room, user }) => {
        socket.to(room).emit("typing", user);
    })

    socket.on("stop typing", ({ room, user }) => {
        socket.to(room).emit("stop typing", user);
    })

    socket.on("new message", (message) => {
        socket.to(message.referredChat).emit("message recieved", message);
    })

    socket.on("new messages", (messages) => {
        // console.log(messages[0].referredChat);
        socket.to(messages[0].referredChat).emit("messages recieved", messages);
    })

    socket.on("new chat", ({ chat, createdBy }) => {
        console.log(chat, createdBy);
        
        if (!chat.users) {
            return console.log("chat.users not defined");
        }

        chat.users.forEach((user) => {
            if (user._id == createdBy._id) return;

            socket.in(user._id).emit("chat created", chat);
        })
    })

    socket.off("setup", () => {
        console.log("User disconnected");
        socket.leave(userData._id);
    })
}

io.on("connection", onConnection);

// Unhandled Promise Rejection

process.on("rejectionHandled", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server due to Uncaught Exception");

    server.close(() => {
        process.exit(1);
    })
})