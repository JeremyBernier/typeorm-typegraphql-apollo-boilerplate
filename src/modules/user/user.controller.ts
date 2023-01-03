import type { Request, Response } from "express";
import express from "express";
import {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./user.service";
import { transporter } from "../mail";
import { signJwtToken, verifyJwtToken } from "../../auth/restrict";

const api = express.Router();
api.use(express.json());

api.get("/", async (req: Request, res: Response) => {
  const users = await getUsers();
  return res.status(200).send(users);
});

api.post("/", async (req: Request, res: Response) => {
  try {
    const newUser = await createUser(req.body);

    if (newUser.email) {
      const token = signJwtToken(
        { email: newUser.email },
        process.env.EXPRESS_SESSION_SECRET,
        { expiresIn: "2d" }
      );
      const verifyUrl = `${process.env.API_URL}/users/verify_email/?token=${token}`;
      transporter.sendMail({
        from: process.env.EMAIL,
        to: newUser.email,
        subject: "Confirm Jeremy Bernier Newsletter Subscription",
        //         text: `Hey it's Jeremy,

        // Click the following like to confirm your email subscription and start receiving updates straight to your inbox: ${token}

        // Link expires in 2 days. Of course your email will never be shared with anyone, and you can cancel anytime.`,
        html: `<p>Hey it's Jeremy,</p>
<p>Click the following like to confirm your email subscription and start receiving updates straight to your inbox: <a href="${verifyUrl}">Email Confirmation Link</a></p>
<p>Link expires in 2 days. Of course your email will never be shared with anyone, and you can cancel anytime.</p>`,
      });
    }
    return res.status(200).send(newUser);
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

api.get("/verify_email", async (req: Request, res: Response) => {
  const token = req.query.token;
  console.log("do token stuff");

  try {
    const [err, decoded] = await verifyJwtToken(
      token,
      process.env.EXPRESS_SESSION_SECRET
    );

    const email = decoded?.email;

    if (!err && email) {
      await updateUser({ email, emailVerified: true });
    }
  } catch (err) {
    console.error(err);
  }

  return res
    .status(200)
    .send("Thank you for confirming your subscription! :) -Jeremy");
});

api.get("/:id", async (req: Request, res: Response) => {
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

api.put("/:id", async (req: Request, res: Response) => {
  try {
    const newPost = await updateUser({ ...req.body, id: req.params.id });
    return res.status(200).send(newPost);
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

api.delete("/:id", async (req: Request, res: Response) => {
  try {
    const deleteRes = await deleteUser({ id: req.params.id });
    return res.status(204).send();
  } catch (err) {
    return res.status(400).send(String(err));
  }
});

export default api;
