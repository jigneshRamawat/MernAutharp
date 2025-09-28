import mongoose from "mongoose";

const connectDB = async ()=>{

    mongoose.connection.on('connected', ()=> console.log("DataBase connected"))

    await mongoose.connect(`${process.env.MONGODB_URI}/Login-register`)
};

export default connectDB;