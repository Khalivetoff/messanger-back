import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./api/user-router";
import './api/messenger-router'
import {Server} from "socket.io";
import initMessengerSocket from "./api/messenger-router";
import agreementsRouter from "./api/agreements";
import {CLIENT_URL, DB_PATH, PORT} from "./constants/config.const";
import * as path from "path";

mongoose.connect(DB_PATH);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();

const server = app.listen(PORT, () => {
    console.log(`server active on port: ${PORT}`);
});

export const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    initMessengerSocket(socket)
})

app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));
app.use('/api/user', userRouter);
app.use('/api/agreements', agreementsRouter);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
})
