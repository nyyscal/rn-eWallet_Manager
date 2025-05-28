import express from "express"
import "dotenv/config"
import  {initDB}  from "./config/db.js"
import rateLimiter from "./middleware/rateLimiter.js"
import router from "./routes/transactionRoutes.js"

const app = express()
const PORT = process.env.PORT || 5001

app.use(express.json())
app.use(rateLimiter)

app.use("/api/transactions",router)

initDB().then(()=>{
    app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
    })
})
