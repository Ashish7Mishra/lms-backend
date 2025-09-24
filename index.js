const express=require("express");
const dotenv=require("dotenv");
const cors = require('cors');
const connectDB=require("./config/db");
const authRoutes=require("./routes/authRoutes");
const courseRoutes = require('./routes/courseRoutes');

//read the env file and load everything into process
dotenv.config();

//run our db connection function
connectDB();

const app=express();

app.use(cors()); //to work with frontend
app.use(express.json()); //middlewire for parsing json bodies

app.get("/",(req,res)=>{
    res.send("Api is running ")
})

app.use("/api/auth",authRoutes);
app.use("/api/courses",courseRoutes);

const PORT=process.env.PORT || 5000;

app.listen(PORT,() =>{
    console.log(`Server is running on PORT : ${PORT}`);
})