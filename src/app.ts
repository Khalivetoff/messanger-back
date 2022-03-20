import express from 'express';
import bodyParser from "body-parser";
import users from "./users";
import mongoose from "mongoose";

mongoose.connect(`mongodb://127.0.0.1/users`);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const app = express();
app.use(bodyParser.json());
app.use('/api/users', users);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`server active on port: ${PORT}`);
});
