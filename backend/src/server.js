import express from "express"
import "dotenv/config"
import  {initDB}  from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"
import router from "./routes/transactionRoutes.js"
import cors from "cors"
const app = express()
const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(rateLimiter)
app.use(cors({
    origin: "http://192.168.1.11:8081"
}))

app.use("/api/transactions",router)

initDB().then(()=>{
    app.listen(PORT,()=>{
    console.log(`Server is running on http://192.168.1.11:${PORT}`)
    })
})
