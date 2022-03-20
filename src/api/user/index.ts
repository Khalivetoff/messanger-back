import * as mongoose from "mongoose";
import {IUser} from "../../models/user";
// import express from "express";

const Schema = mongoose.Schema;
const UserSchema = new Schema<IUser>({ login: String, password: String });
const Users = mongoose.model('Users', UserSchema);

// const users = express.Router();

export default Users;
