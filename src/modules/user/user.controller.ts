import express from "express";
import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./user.service";

const api = express.Router();
api.use(express.json());

api.get("/", async (req: any, res) => {
  const users = await getUsers();
  return res.status(200).send(users);
});

api.get("/:id", async (req: any, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
});

api.post("/", async (req: any, res) => {
  try {
    const newUser = await createUser(req.body);
    return res.status(200).send(newUser);
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

api.put("/:id", async (req: any, res) => {
  try {
    const newPost = await updateUser({ ...req.body, id: req.params.id });
    return res.status(200).send(newPost);
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

api.delete("/:id", async (req: any, res) => {
  try {
    const deleteRes = await deleteUser({ id: req.params.id });
    return res.status(204).send();
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

export default api;
