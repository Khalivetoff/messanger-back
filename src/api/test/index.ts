import express from "express";
import isAuth from "../../middleware/isAuth";

const test = express.Router();

test.get('/test', isAuth, (req, res) => {
    res.send('test')
})

export default test;

