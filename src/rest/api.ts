import express from "express";
import post from "../modules/post/post.controller";
import user from "../modules/user/user.controller";
// import { upload, handleUpload } from "./upload";

const api = express.Router();

api.use(express.json());

api.use("/posts", post);
api.use("/users", user);

api.get("/test", (req, res) => res.status(200).send("testing REST api"));

// api.post("/upload", upload.single("profile_pic"), handleUpload);

export default api;
