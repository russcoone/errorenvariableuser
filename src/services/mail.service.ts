import { transport } from "../config/mailer";
import { IMailOptions } from "../interfaces/email.interface";

class MailService {
  send(mail: IMailOptions) {
    return new Promise((resolvers, reject) => {
      transport.sendMail(
        {
          from: '" 🛍️ Vicky Store 🛍️" <soporteti@comservice.mx>', // sender address
          to: mail.to, // list of receivers
          subject: mail.subject, // Subject line
          //text: "Hello world?", // plain text body//
          html: mail.html, // html body
        },
        (error, _) => {
          error
            ? reject({
                status: false,
                message: error,
              })
            : resolvers({
                status: true,
                message: "Email correctamente enviado a " + mail.to,
                mail,
              });
        }
      );
    });
  }
}

export default MailService;
