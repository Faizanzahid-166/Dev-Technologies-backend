// config/db.js
import mongoose from 'mongoose';
import {DB_NAME} from './constant.js'

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URI}`)
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        //console.log(connectionInstance)
        console.log("connecting",DB_NAME, process.env.MONGO_DB_URI);
        
        
    } catch (error) {
        console.log("MONGODB connection error", error);
        process.exit(1)        
    }
}

// export default connectDB
