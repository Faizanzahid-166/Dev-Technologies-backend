// server.js
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import {server} from './server.js'

dotenv.config({
    path: './.env'
});
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


