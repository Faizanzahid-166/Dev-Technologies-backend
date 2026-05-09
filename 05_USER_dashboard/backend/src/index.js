// index.js
import "./config/dotenv.js"; // load .env first
import connectDB from './database//mongodb/db.js';
import {server} from './server.js'
import redisService from "./database/redis/redis.js"

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

// connectDB()
// .then(() => {
//   server.listen(process.env.PORT || 5000, () => {
//     console.log(`port is running at ${process.env.PORT}`);
    
//    })
// })
// .catch((error) => {
//     console.log("connection failed !!!",error)
// })

const startServer = async () => {
  await connectDB();
 
  // Try to connect Redis (non-blocking — app runs without it)
  await redisService.connect();
 
  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   API: http://localhost:${PORT}/api\n`);
  });
};
 
startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

