import mongoose from "mongoose";

export default function dbConnect()
{
    mongoose.connect(process.env.MONGO_URI!).then(()=>{
        const connection = mongoose.connection;
        connection.on('connected',()=>{
            console.log("database successfully connected");
        })
        connection.on('error',(err)=>{
            console.log("Found error : ",err);
            console.log("Could not connect to the database");
        })
    }).catch((error)=>{
        console.log("Error in connectinf to db");
        process.exit(0);
    })
}