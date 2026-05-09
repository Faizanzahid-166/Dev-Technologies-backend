// index.js
import "./config/dotenv.js"; // load .env first
 import {connectDB} from './database/mongodb.js';
import {server} from './server.js'

connectDB()
.then(() => {
  const port = process.env.PORT || 5000;
  server.listen(port, () => {
    console.log(`port is running at ${port}`);
   });
})
.catch((error) => {
    console.log("connection failed !!!",error)
})