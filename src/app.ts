import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./api/user-router";
import './api/messenger-router'
import {Server} from "socket.io";
import initMessengerSocket from "./api/messenger";
import agreementsRouter from "./api/agreements";

mongoose.connect(`mongodb://127.0.0.1/messenger`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

//FIXME: вынести в .env
const PORT = 3000;

const server = app.listen(PORT, () => {
    console.log(`server active on port: ${PORT}`);
});

export const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8080',
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    initMessengerSocket(socket)
})

app.use(bodyParser.json());
app.use('/api/user', userRouter);
app.use('/api/agreements', agreementsRouter);
