import express from "express";
import post from "./controllers/post";
// import { upload, handleUpload } from "./upload";

const api = express.Router();

api.use(express.json());

api.use("/posts", post);

api.get("/test", (req, res) => res.status(200).send("testing REST api"));

// api.post("/upload", upload.single("profile_pic"), handleUpload);

export default api;
