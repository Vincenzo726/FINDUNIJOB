function send(res, status, data, message) {
  return res.status(status).json({ success: status < 400, message, data });
}

module.exports = { send };