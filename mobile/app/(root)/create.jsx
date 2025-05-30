import { View, Text, Alert, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { API_URL } from '../../constants/api'
import {styles} from "../../assets/styles/create.styles"
import {Ionicons} from "@expo/vector-icons"
import { COLORS } from '../../constants/colors'
const CATEGORIES = [
  {id:"food",name:"Food & Drinks", icon:"fast-food"},
  {id:"bills",name:"Food & DrinksBills", icon:"receipt"},
  {id:"other",name:"Other", icon:"ellipsis-horizontal"},
]

const Create = () => {
  const router = useRouter()

  const {user} = useUser()

  const [title,setTitle] = useState("")
  const [amount,setAmount] = useState("")
  const [selectedCategory,setSelectedCategory] = useState("")
  const [isExpense,setIsExpense] = useState(true)
  const [isLoading,setIsLoading] = useState(false)

  const handleCreate = async()=>{
    if(!title.trim()) return Alert.alert("Error","Please enter a transaction title to proceed")
      if(!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0){
        Alert.alert("Error","Please enter a valid amount")
        return
      }

      if(!selectedCategory) return Alert.alert("Error","Please select and cateogory")
        setIsLoading(true)
    try {
      const formatAmount = isExpense ? -Math.abs(parseFloat(amount)):Math.abs(parseFloat(amount))
      const response = await fetch(`${API_URL}/transactions`,{method:"POST",headers:{
        "Content-Type":"application/json"
      },
    body: JSON.stringify({
      user_id: user.id,
      title,
      amount:formatAmount,
      category:selectedCategory
    })
    })
    if(!response.ok){
      const error = await response.json()
      console.log(error)
      throw new Error(error.error || "Failed to create a transcation")
    }
    Alert.alert("Success","Transaction created succesfully")
    router.back()
    } catch (error) {
    Alert.alert("Error","Transaction denied ")
    console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <View style={styles.container}>
      {/* Headers */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={()=> router.back()}>
          <Ionicons name='arrow-back' size={24} color={COLORS.text}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}> New Transaction</Text>
        <TouchableOpacity style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]} onPress={handleCreate} disabled={isLoading}>
          <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
          {!isLoading && <Ionicons name='checkmark' size={18} color={COLORS.primary}/>}
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <View style={styles.typeSelector}>
          <TouchableOpacity style={[styles.typeButton, isExpense && styles.typeButtonActive]} onPress={()=>setIsExpense(true)}>
            <Ionicons name='arrow-down-circle' size={22} color={isExpense ? COLORS.white : COLORS.expense} style={styles.typeIcon}/>
            <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.typeButton, !isExpense && styles.typeButtonActive]} onPress={()=>setIsExpense(false)}>
            <Ionicons name='arrow-up-circle' size={22} color={!isExpense ? COLORS.white : COLORS.expense} style={styles.typeIcon}/>
            <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* Amount Container */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput style={styles.amountInput} placeholder='0.00' placeholderTextColor={COLORS.textLight} value={amount} onChangeText={setAmount} keyboardType='numeric'/>
        </View>

        {/* Input Container */}
        <View style={styles.inputContainer}>
          <Ionicons name='create-outline' size={22} color={COLORS.textLight} style={styles.inputIcon}/>
          <TextInput style={styles.input} placeholder='Transaction Title' placeholderTextColor={COLORS.textLight} value={title} onChangeText={setTitle}/>
        </View>

        {/* Title */}
        <Text style={styles.sectionTitle}>
          <Ionicons name='pricetag-outline' style={{marginLeft:2}} size={16} color={COLORS.text}/>
          Category
        </Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category)=>(
            <TouchableOpacity key={category.id} style={[styles.categoryButton, selectedCategory === category.name && styles.categoryButtonActive]} onPress={()=>setSelectedCategory(category.name)}>
              <Ionicons name={category.icon} size={20} color={selectedCategory === category.name ? COLORS.white : COLORS.text}/>
              <Text style={[styles.categoryButtonText, selectedCategory===category.name && styles.categoryButtonTextActive]}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary}/>
        </View>
      )}
    </View>
  )
}

export default Create