import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnection from './db/conn.js';
import userRouter from './routes/userRoutes.js';
import path from 'path';

dotenv.config();

await dbConnection();
const app = express();
const PORT = 7000;
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter)

app.listen(PORT, () => {
    console.log(`server is running on port http://localhost:${PORT}`);
});