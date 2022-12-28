import express from "express";
import post from "../modules/post/post.controller";
import user from "../modules/user/user.controller";
// import { upload, handleUpload } from "./upload";

const api = express.Router();

api.use(express.json());

api.use("/posts", post);
api.use("/users", user);

api.post("/login", async (req: any, res) => {
  const { email, password } = req.body;
  console.log("req.body", req.body);
  // const user = await this.userRepository.findOne({ where: whereObj });
  // req.session.regenerate(() => {
  //   req.session.user = {
  //     email: "fake@user.com",
  //     username: "charlie",
  //   };
  // });

  req.session.user = {
    email: "fake@user.com",
    username: "charlie",
  };
  console.log("req.session", req.session);
  return res.status(200).send();
});

function restrict(req, res, next) {
  console.log("restrict check - req.session", req.session);
  if (req.session.user) {
    next();
  } else {
    req.session.error = "Access denied!";
    res.redirect("/login");
  }
}

api.get("/restricted", restrict, (req, res) => {
  console.log("req.session", req.session);
  res.send("Restricted stuff here brah " + req.session.user.email);
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
