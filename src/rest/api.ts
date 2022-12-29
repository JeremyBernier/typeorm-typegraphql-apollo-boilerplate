import express from "express";
import post from "../modules/post/post.controller";
import user from "../modules/user/user.controller";
import jwt from "jsonwebtoken";
import restrict from "../auth/restrict";
// import { upload, handleUpload } from "./upload";

const api = express.Router();

api.use(express.json());

api.use("/posts", post);
api.use("/users", user);

api.post("/login", async (req: any, res, next) => {
  const { email, password } = req.body;
  console.log("req.body", req.body);

  const existingUser = {
    id: "some-id-goes-here",
    email: "your@email.com",
  };

  let token;
  try {
    //Creating jwt token
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.EXPRESS_SESSION_SECRET,
      { expiresIn: "7d" }
    );
  } catch (err) {
    console.log(err);
    const error = new Error("Error! Something went wrong.");
    return next(error);
  }

  return res.status(200).json({
    success: true,
    data: {
      userId: existingUser.id,
      email: existingUser.email,
      token,
    },
  });
});

api.get("/restricted", restrict, (req, res) => {
  // console.log("req.session", req.session);
  // console.log("req.headers", req.headers);

  // const token = req.headers.authorization.split(" ")[1];
  // //Authorization: 'Bearer TOKEN'
  // if (!token) {
  //   res
  //     .status(200)
  //     .json({ success: false, message: "Error! Token was not provided." });
  // }
  // //Decoding the token
  // const decodedToken = jwt.verify(token, process.env.EXPRESS_SESSION_SECRET);
  // console.log("decodedToken", decodedToken);

  res.send("Restricted stuff here");
  // res.send("Restricted stuff here brah " + req.session.user.email);
});

api.get("/test2", (req, res) => {
  console.log("req.session", req.session);
  res.status(200).send("test stuff2");
});

api.post("/forgot_password", async (req: any, res) => {
  // const token = generateToken();
  // transporter.sendMail({ sendSomeMail})
  return res.status(200).send();
});

api.get("/logout", (req, res) => {
  req.session.destroy();
  res.status(200).send();
});

api.get("/test", (req, res) => res.status(200).send("testing REST api"));

// api.post("/upload", upload.single("profile_pic"), handleUpload);

export default api;
