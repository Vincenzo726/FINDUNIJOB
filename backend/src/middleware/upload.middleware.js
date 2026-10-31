const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const directory = path.resolve(process.env.UPLOAD_DIR || 'uploads');
fs.mkdirSync(directory, { recursive: true });
const allowed = new Map([
  ['application/pdf', '.pdf'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
]);
const upload = multer({
  storage: multer.diskStorage({
    destination: directory,
    filename: (req, file, cb) => cb(null, `${crypto.randomBytes(16).toString('hex')}${path.extname(file.originalname).toLowerCase()}`),
  }),
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE_MB || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.get(file.mimetype) === extension);
  },
});
module.exports = { upload, uploadDirectory: directory };