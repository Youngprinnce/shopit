const sendGridMail = require('@sendgrid/mail');
const ErrorHandler = require('../utils/errorHandler');
require('dotenv').config({ path: 'backend/config/config.env' })
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

// eslint-disable-next-line consistent-return
const sendMail = async (email, subject, message) => {
  try {
    const data = {
      to: `${email}`,
      from: 'ShopIT <ebukanathan@gmail.com>',
      subject,
      html: message,
    };
    await sendGridMail.send(data);
  } catch (err) {
    return next(new ErrorHandler(err.message, 404));
  }
};

module.exports = sendMail;