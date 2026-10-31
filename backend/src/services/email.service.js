async function sendEmail() {
  const error = new Error('Email delivery is not configured');
  error.statusCode = 503;
  throw error;
}

module.exports = { sendEmail };