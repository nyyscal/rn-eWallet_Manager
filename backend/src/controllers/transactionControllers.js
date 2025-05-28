import { sql } from "../config/db.js"

export const createTransaction = async(req,res)=>{
  try {
    const {title, amount,category, user_id} = req.body
    if(!title || amount===undefined || !category || !user_id){
      return res.status(400).json({message:"All fields are required!"})
    }
    const transcation = await sql`
    INSERT INTO transactions(user_id,title,category,amount)
    VALUES (${user_id},${title},${category},${amount})
    RETURNING *
    `
    // console.log(transcation)
    res.status(201).json(transcation[0])
  } catch (error) {
    console.log("Error in the transaction",error)
    res.status(500).json({message:"Internal Server Error"})
  }
}

export const deleteTransaction = async(req,res)=>{
  try {
    const {id} = req.params

    if(isNaN(parseInt(id))){
      return res.status(400).json({message:"Invalid ID!"})
    }

    const result = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *`

    if(result.length === 0){
      return res.status(404).json({message:"Transaction not found!"})
    }

    res.status(200).json({message:"Transaction Deleted Succesfully!"})
  } catch (error) {
     console.log("Error in the DELETE transaction",error)
    res.statusCode(500).json({message:"Internal Server Error"})
  }
}

export const transactionSummary = async(req,res)=>{
  try {
    const {userId} = req.params
    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
    `
    const incomeResult = await sql`
    SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0 
    `
    const expensesResult = await sql`
    SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0 
    `
    res.status(200).json({
      balance:balanceResult[0].balance,
      income:incomeResult[0].income,
      expenses:expensesResult[0].expenses,
    })

  } catch (error) {
     console.log("Error in the SUMMARY transaction",error)
    res.statusCode(500).json({message:"Internal Server Error"})
}
}

export const getUserTransaction = async(req,res)=>{
  try {
    const {userId} = req.params
    console.log(userId)
    const transactions = await sql`
    SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC`
    res.status(200).json(transactions)
  } catch (error) {
     console.log("Error in the GET transaction",error)
    res.statusCode(500).json({message:"Internal Server Errror"})
  }
}