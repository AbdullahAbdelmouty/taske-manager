const express = require("express");
const app = express();
const tasks = require("./Routes/tasks");
const connectDB = require('./db/connect');
require("dotenv").config();
// middleware
app.use(express.json());
// const path = require("path");
// app.use(express.static("./public"));

app.get("/",(req,res)=>{
    // res.sendFile(path.resolve(__dirname,'./index.html'))
    res.send("hello world")
})
app.use('/api/v1/tasks',tasks)
const port = 3000;

const start = async() =>{
    try{
        await connectDB(process.env.URL)
        app.listen(port,()=>{
            console.log(`server listening to ${port}`);
        })
    }
    catch(err){
        console.log(err);
    }
}

start();