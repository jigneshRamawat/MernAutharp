import express from "express";
import cors from "cors";
import 'dotenv/config'
import cookieParser from 'cookie-parser';
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authroutes.js';
import userRouter from "./routes/userRoutes.js";

const app = express();

const port = process.env.PORT || 4000

connectDB();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Use CORS properly
app.use(cors(corsOptions));


app.use(express.json());

app.use(cookieParser());



app.get('/', (req, res) => {
    res.send("API Working Fine")
})

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(port, () => {
    console.log(`server started on PORT : ${port}`)
});
