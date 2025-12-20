import mongoose from 'mongoose'
import {DB_NAME} from '../constant.js'


const connectDB = async () => { 
    try {
      const connectionInstance =  await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`)
      console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        //console.log(connectionInstance)
} catch (error) {
   console.log("MONGODB connection error", error);
    process.exit(1)  
    
}}

export default connectDB