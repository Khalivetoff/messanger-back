import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userRouter from "./api/user-router";
import messengerRouter from "./api/messenger-router";

mongoose.connect(`mongodb://127.0.0.1/messenger`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const app = express();
app.use(bodyParser.json());
app.use('/api/user', userRouter);
app.use('/api/messenger', messengerRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server active on port: ${PORT}`);
});

export default app;
