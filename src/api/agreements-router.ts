import express from "express";
import {AGREEMENTS} from "../constants/agreements.const";

const agreementsRouter = express.Router();

agreementsRouter.get('/', async (req, res) => {
    res.json(AGREEMENTS);
})

export default agreementsRouter;
