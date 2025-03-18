// step-1. - creating server
const express=require("express");
const app=express();

app.listen(5000, ()=>{
    console.log("server listning on 5000")
})
