import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 587),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    });
  }

  sendEmail(
    to: string,
    subject: string,
    content: string
  ) {
    const mailOptions: Mail.Options = {
      from: `"No Reply" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      text: content,
      //html: "<h1>Meu email</h1>"
    }

    this.transporter.sendMail(mailOptions)
      .catch(() => { //feito assim, para que não precise do await
        console.log('Erro ao enviar o email.');
      });
  }

  // async sendEmail(
  //   to: string,
  //   subject: string,
  //   content: string
  // ) {
  //   const mailOptions: Mail.Options = {
  //     from: `"No Reply" <${process.env.EMAIL_FROM}>`,
  //     to,
  //     subject,
  //     text: content,
  //     //html: "<h1>Meu email</h1>"
  //   }

  //   await this.transporter.sendMail(mailOptions);
  // }
}
