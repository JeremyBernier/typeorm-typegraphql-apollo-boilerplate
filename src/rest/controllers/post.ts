import express from "express";
import { getPosts } from "../../services/post/get";

const api = express.Router();
api.use(express.json());

api.get("/", async (req: any, res) => {
  const posts = await getPosts();
  return res.status(200).send(posts);
});

api.get("/:pid", async (req: any, res) => {
  return res.status(200).send(req.params.pid);
});

export default api;
