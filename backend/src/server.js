require('dotenv').config();
const app = require('./app');
const connectDatabase = require('./config/database');

const port = Number(process.env.PORT || 5000);
async function start() {
  await connectDatabase();
  app.listen(port, () => console.log(`FindUniJob API listening on port ${port}`));
}
if (require.main === module) start().catch((error) => { console.error('Unable to start server:', error.message); process.exitCode = 1; });
module.exports = { start };