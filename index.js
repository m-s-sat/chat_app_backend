require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')

async function main(){
    await mongoose.connect(process.env.MONGODB_URI);
}
main().then(()=>{
    console.log("mongodb is connected")
}).catch((err)=>{
    console.log(err);
})

const app = express();

app.use(cors());
app.use(express.json());

app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on port ${process.env.PORT}`);
})
