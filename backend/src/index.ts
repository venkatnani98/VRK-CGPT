import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

//Connections and Listeners
const PORT = process.env.PORT || 5000;


connectToDatabase()
  .then(()=>{
    app.listen(PORT, ()=> console.log("Server Open and Connected to Database"));
  })
  .catch((error)=>{
    console.error(error);
  })