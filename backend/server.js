const app = require("./src/app");
const connectToDb = require("./src/config/connectToDb");
require('dotenv').config()
const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  connectToDb();
  console.log(`server running on PORT : ${PORT}`);
});

