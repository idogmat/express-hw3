import nodemailer from 'nodemailer'

export const emailService = {
  async transporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL, // generated ethereal user
        pass: process.env.EMAIL_PWD, // generated ethereal password
      },
    })
  },
  async sendMail(name: string, mail: string, link: string) {
    let transporter = await this.transporter()
    transporter.sendMail({
      from: 'Jack', // sender address
      to: mail, // list of receivers
      subject: "Authorization", // Subject line
      html: `
          <div>
            <h1>Thank for your registration</h1>
            <h2>Hello :${name}</h2><br>
            <b>Mail:${mail}</b><br>
            <b>To confirm your email, you need to follow the link.:${link}</b><br>
          </div>
      `});
  }
}