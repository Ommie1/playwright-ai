require('dotenv').config();

module.exports = {
  baseURL: process.env.BASE_URL || 'https://govgpt.sandbox.dge.gov.ae/',
  email: process.env.USER_EMAIL,
  password: process.env.USER_PASSWORD,
  STREAMING_WAIT_MS: process.env.STREAMING_WAIT_MS || 60000 // default 60s
};
