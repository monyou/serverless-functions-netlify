const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL_SERVICE_AUTH_EMAIL,
    pass: process.env.EMAIL_SERVICE_AUTH_PASS,
  },
});

const handler = async (event, context) => {
  await new Promise((resolve) => {
    transporter.sendMail({ to: "monyou@abv.bg", text: "Hello World!" }, () =>
      resolve()
    );
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World! Message sent successfully!",
    }),
  };
};

module.exports = { handler };
