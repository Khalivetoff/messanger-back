import express from 'express';
import bodyParser from "body-parser";
import mongoose from "mongoose";
import user from "./api/user";
import test from "./api/test";

mongoose.connect(`mongodb://127.0.0.1/messanger`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const app = express();
app.use(bodyParser.json());
app.use('/api/user', user);
app.use('/api/test', test);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server active on port: ${PORT}`);
});

export default app;
