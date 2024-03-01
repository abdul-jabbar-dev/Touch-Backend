import cors from "cors";
import express from "express"; 
import "dotenv/config";
 
 const app = express(); 
app.use(cors());
app.use(express.json());  
export default app