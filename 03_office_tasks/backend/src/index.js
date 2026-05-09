// index.js
import "./config/dotenv.js"; // load .env first
import connectDB from './database//mongodb/db.js';
import {server} from './server.js'

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

connectDB()
.then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`port is running at ${process.env.PORT}`);
    
   })
})
.catch((error) => {
    console.log("connection failed !!!",error)
})

