import express, { Express } from 'express';
import dotenv from 'dotenv';
import { productRouter, userRouter } from './routes';
import bodyParser from 'body-parser';

dotenv.config();

const app:Express = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/user',userRouter)
app.use('/api/product',productRouter)

app.listen(process.env.PORT,()=>{
    console.log("app is running on 8080");
})