const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
require('dotenv').config();

const { host, port, user, pass, service } = {
  service: process.env.MAIL_SERVICE,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
};

const transport = nodemailer.createTransport({
  service,
  host,
  secure: true,
  port,
  auth: { user, pass },
});

console.log(`Mailer: ${service}://${user}:${pass}@${host}:${port}`);

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve('./src/resources/mail/')
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  })
);

module.exports = transport;