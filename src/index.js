import connectDB from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./env",
});

connectDB()

.then(()=>{
    app.listen(process.env.PORT || 8000, () =>{
        console.log(`SAerver is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB Connection Failed !!!", err);
})

// import express from "express";
// const app = express();
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/ ${DB_NAME} `);

//     app.on("error", (error) => {
//         console.log("ERRR: ", error);
//         throw err
//     })

//     app.listen(process.env.PORT,()=>{
//         console.log(`App is listening to port ${process.env.PORT}`);
//     })
//   } catch (error) {
//     console.log("ERROR: ", error);
//     throw err;
//   }
// })();
