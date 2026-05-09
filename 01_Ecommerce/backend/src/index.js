// server.js
import "./config/dotenv.js"; // load .env first
import connectDB from './database/database.js';
import {server} from './server.js'

connectDB()
.then(() => {
  server.listen(process.env.PORT || 5000, () => {
    console.log(`port is running at ${process.env.PORT}`);
    
  })
})
.catch((error) => {
    console.log("connection failed !!!",error)
})



// const app = express();
// app.use(cors());
// app.use(express.json());

//app.use('/api/products', productRoutes);


