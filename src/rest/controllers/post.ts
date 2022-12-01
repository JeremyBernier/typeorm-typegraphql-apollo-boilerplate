import express from "express";

const api = express.Router();
api.use(express.json());

api.get("/", async (req: any, res) => {
  return res.status(200).send("all posts");
});

api.get("/:pid", async (req: any, res) => {
  return res.status(200).send(req.params.pid);
});

export default api;
