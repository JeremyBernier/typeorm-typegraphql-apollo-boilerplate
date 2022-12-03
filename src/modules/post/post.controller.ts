import express from "express";
import { getPost, getPosts, createPost } from "./post.service";

const api = express.Router();
api.use(express.json());

api.get("/", async (req: any, res) => {
  const posts = await getPosts();
  return res.status(200).send(posts);
});

api.get("/:id", async (req: any, res) => {
  try {
    const post = await getPost(req.params.id);
    return res.status(200).send(post);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
});

api.post("/", async (req: any, res) => {
  try {
    const newPost = await createPost(req.body);
    return res.status(200).send(newPost);
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

api.put("/:id", async (req: any, res) => {
  return res.status(200).send(req.params.id);
});

api.delete("/:id", async (req: any, res) => {
  return res.status(200).send(req.params.id);
});

export default api;
