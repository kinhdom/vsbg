import request from "request";
import { Router } from "express";
const scanRouter = Router();
import { fetchData } from "./function";

scanRouter.get('/group', (req, res) => {
    res.json({ a: 3 })
})

export default scanRouter;