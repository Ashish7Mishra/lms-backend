const express=require("express")
const dotenv=require("dotenv")
const connectDB=require("./config/db");

//read the env file and load everything into process
dotenv.config();

//run our db connection function
connectDB();

const app=express();


app.get("/",(req,res)=>{
    res.send("Api is running ")
})

const PORT=process.env.PORT || 5000;

app.listen(PORT,() =>{
    console.log(`Server is running on PORT : ${PORT}`);
})