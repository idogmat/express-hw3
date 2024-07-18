import nodemailer from "nodemailer";
import "dotenv/config";

export const emailService = {
  async transporter() {
    return nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.EMAIL_PWD, // generated ethereal password
      },
    });
  },
  async sendMail(name: string, mail: string, code: string) {
    const transporter = await this.transporter();
    const url = process.env.CONFIRM_EMAIL + code;
    transporter.sendMail({
      from: "Jack", // sender address
      to: mail, // list of receivers
      subject: "Authorization", // Subject line
      html: `
      <h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
        <a href=${url}>complete registration</a>
      </p>
    
      `,
    });
  },
};
