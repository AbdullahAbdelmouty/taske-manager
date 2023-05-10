const express = require("express");
const app = express();
const tasks = require("./Routes/tasks");
const connectDB = require('./db/connect');
const notFound = require("./middleware.js/not-found");
const errorHandlerMidlleware = require("./middleware.js/error-handler");
require("dotenv").config();
// middleware
app.use(express.json());
// const path = require("path");
app.use(express.static("./public"));
app.use('/api/v1/tasks',tasks)
app.use(notFound)
app.use(errorHandlerMidlleware)
const port = process.env.PORT || 3000;

const start = async() =>{
    try{
        await connectDB(process.env.MONGODB_URL)
        app.listen(port,()=>{
            console.log(`server listening to ${port}`);
        })
    }
    catch(err){
        console.log(err);
    }
}

start();
