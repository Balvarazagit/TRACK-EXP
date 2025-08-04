import React, { useState ,useEffect} from "react";
import "../styles/ExpenseForm.css";
import { useAuth } from "../context/AuthContext";
import { useFlatmate } from '../context/FlatmateContext';
import { toast } from "react-toastify";

const ExpenseForm = ({ addExpense, darkMode }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();
  const { group } = useFlatmate();
// console.log("Group from context:", group);

//   console.log("Logged-in user:", user);

useEffect(() => {
  console.log("Logged-in user:", user);
  console.log("Flatmate group loaded:", group); // ✅ should show full group object with group.id
}, [user, group]);


 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !amount || !date || !category) return;

 const newExpense = {
   title,
   amount: parseFloat(amount),
   date,
   category,
   userId: user.id || user._id,  // 👈 required by MongoDB schema
   groupId: group?._id || group?.id,
 };

console.log("Expense to be submitted:", newExpense);

  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExpense),
    });

    const data = await response.json();
    if (!response.ok) {
      toast.error(data.message || "Failed to add expense");
    }
    else{
      toast.success("Succesfully Created!")
    }

    // Update frontend state if needed
    addExpense(data); // You can use the returned saved expense
    setTitle("");
    setAmount("");
    setDate("");
    setCategory("");
  } catch (err) {
    console.error("Error adding expense:", err.message);
    toast.error("Failed to add expense: " + err.message);
  }
};


  return (
    <form onSubmit={handleSubmit} className={`expense-form ${darkMode ? 'dark' : 'light'}`}>
      <div className="form-header">
        <h2 className="form-title">Add New Expense</h2>
        <div className="form-icon">💰</div>
      </div>

      <div className="form-fields">
        <div className="form-group animate-fade">
          <label htmlFor="title" className="form-label">
            <span className="label-icon">📝</span> Expense Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dinner, Taxi, etc."
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group animate-fade" style={{ animationDelay: "0.1s" }}>
          <label htmlFor="amount" className="form-label">
            <span className="label-icon">💲</span> Amount
          </label>
          <div className="input-with-icon">
            <span className="currency-symbol">₹</span>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="form-input"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
        
        <div className="form-group animate-fade" style={{ animationDelay: "0.2s" }}>
          <label htmlFor="category" className="form-label">
            <span className="label-icon">🏷️</span> Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Category</option>
            <option value="Food">🍔 Food</option>
            <option value="Travel">🚕 Travel</option>
            <option value="Bills">🧾 Bills</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Entertainment">🎬 Entertainment</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>
        
        <div className="form-group animate-fade" style={{ animationDelay: "0.3s" }}>
          <label htmlFor="date" className="form-label">
            <span className="label-icon">📅</span> Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            required
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="btn-submit animate-fade hover-grow"
        style={{ animationDelay: "0.4s" }}
      >
        <span className="btn-icon">➕</span> Add Expense
      </button>
    </form>
  );
};

export default ExpenseForm;