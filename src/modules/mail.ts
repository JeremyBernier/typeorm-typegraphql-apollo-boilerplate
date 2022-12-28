import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "email@email.com",
    pass: "password goes here",
  },
});
