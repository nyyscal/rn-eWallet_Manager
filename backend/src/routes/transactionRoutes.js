import express from "express"
import { createTransaction, deleteTransaction, getUserTransaction, transactionSummary } from "../controllers/transactionControllers.js"

const router = express.Router()

router.post("/",createTransaction),
router.get("/:userId",getUserTransaction),
router.delete("/:id",deleteTransaction),
router.get("/summary/:userId",transactionSummary)

export default router