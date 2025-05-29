//react custom hook
import {Alert} from "react-native"
const { useState, useCallback } = require("react")

const API_URL = "http://localhost:5001/api"

export const useTransaction = (userId)=>{
  const [transactions,setTransactions]= useState([])
  const [summary,setSummary] = useState({
    balance:0,
    income:0,
    expense:0
  })
  const [isLoading,setIsLoading] = useState(true)


  //useCallback for performance
  const fetchTransactions = useCallback(async()=>{
    try {
      const res = await fetch(`${API_URL}/transactions/${userId}`)
      const data = await res.json()
      setTransactions(data)
    } catch (error) {
      console.error("Error fetchingtransactions:",error)
    }
  })
  const fetchSummary = useCallback(async()=>{
    try {
      const res = await fetch(`${API_URL}/transactions/summary/${userId}`)
      const data = await res.json()
      setSummary(data)
    } catch (error) {
      console.error("Error fetchingtransactions:",error)
    }
  })

  const loadData = useCallback(async()=>{
    if(!userId) return;
    setIsLoading(true)
    try {
      await Promise.all([fetchTransactions(),fetchSummary()])
    } catch (error) {
      console.error("Error loading data:",error)
    }finally{
      setIsLoading(false)
    }
  },[fetchSummary,fetchTransactions,userId])

  const deleteTransaction = async(id)=>{
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`,{method:"DELETE"})
      if(!res.ok) throw new Error("Failed to delete transaction.")
      loadData()
      Alert.alert("Success","Transaction deleted succesfully!")
    } catch (error) {
      console.error("Error deleting transaction:",error)
      Alert.alert("Error",error.message)
    }
  }

  return {
    transactions,
    summary,
    isLoading,
    loadData,
    deleteTransaction
  }
}
