import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { userRouter } from './src/routes';
import bodyParser from 'body-parser';

dotenv.config();

const app:Express = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/user',userRouter)

app.listen(process.env.PORT,()=>{
    console.log("app is running on 8080");
})