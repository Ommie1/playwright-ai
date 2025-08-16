require('dotenv').config();

module.exports = {
  baseURL: process.env.BASE_URL || 'https://govgpt.sandbox.dge.gov.ae/',
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD
};
