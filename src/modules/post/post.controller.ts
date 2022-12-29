import express from "express";
import {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "./post.service";
import restrict, { authorize } from "../../auth/restrict";

const api = express.Router();
api.use(express.json());

api.get("/", async (req: any, res) => {
  if (req.query.include_drafts != null) {
    const err = await authorize(req);
    if (err) {
      return res.status(err.status || 403).send(err.message);
    }
  }
  const posts = await getPosts(req.query);
  return res.status(200).send(posts);
});

api.get("/:id", async (req: any, res) => {
  try {
    const post = await getPost(req.params.id);
    if (!post) {
      return res.status(404).send();
    }
    return res.status(200).send(post);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
});

api.post("/", restrict, async (req: any, res) => {
  try {
    const newPost = await createPost(req.body);
    return res.status(200).send(newPost);
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

api.put("/:id", restrict, async (req: any, res) => {
  try {
    console.log("put");
    const newPost = await updatePost({ ...req.body, id: req.params.id });
    console.log("newPost", newPost);
    return res.status(200).send(newPost);
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

api.delete("/:id", restrict, async (req: any, res) => {
  try {
    const deleteRes = await deletePost({ id: req.params.id });
    return res.status(204).send();
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

export default api;
