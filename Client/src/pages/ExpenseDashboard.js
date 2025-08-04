import React, { useState, useEffect } from "react";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import ExpenseSummary from "../components/ExpenseSummary";
import ExpenseChart from "../components/ExpenseChart";
import "../styles/ThemeToggle.css";
import "../styles/ExpenseDashboard.css";
import FlatmateModal from '../components/FlatmateModal';
import { useFlatmate } from '../context/FlatmateContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ExpenseDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { group } = useFlatmate();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
  const checkIfMobile = () => {
    const isMobile = window.innerWidth < 768 || 
                    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    setIsMobile(isMobile);
  };
  
  checkIfMobile();
  window.addEventListener('resize', checkIfMobile);
  return () => window.removeEventListener('resize', checkIfMobile);
}, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!group?._id) return;

      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses?groupId=${group._id}`);
        const data = await res.json();
        setExpenses(data);
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };

    fetchExpenses();
  }, [group]);

  useEffect(() => {
    const data = localStorage.getItem("expenses");
    if (data) setExpenses(JSON.parse(data));
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses([expense, ...expenses]);
  };

 const deleteExpense = async (id) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/expenses/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setExpenses(expenses.filter(exp => exp._id !== id));
      toast.success("Succesfully Deleted!")
    } else {
      console.error('Failed to delete expense');
    }
  } catch (err) {
    console.error('Error deleting expense:', err);
  }
};


  const filteredExpenses = filterCategory
    ? expenses.filter((e) => e.category === filterCategory)
    : expenses;

  return (
    <div className={`app-container ${darkMode ? "dark" : "light"}`}>
      <div className="main-container">
        <header className={`app-header ${darkMode ? "dark" : "light"}`}>
          <div className="header-content">
            <div className="header-left">
              <h1 className="app-title">
                <span className="app-icon">💰</span>
                <span>Expense Tracker</span>
              </h1>
            </div>

            <div className="header-right">
  <button
    onClick={() => setShowModal(true)}
    className="flatmate-button"
    aria-label="Manage flatmates"
  >
    <span className="button-icon">👥</span>
    {!isMobile && <span className="button-text">Flatmates</span>}
  </button>
  
  <button
    onClick={() => setDarkMode(!darkMode)}
    className="theme-toggle"
    aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
  >
    {darkMode ? "☀️" : "🌙"}
  </button>
</div>
          </div>
        </header>

        <div className="content-grid">
          <div className="form-section">
            <div className="card-dashboard form-card hover-grow animate-fade">
              <h2 className="section-title">➕ Add New Expense</h2>
              <ExpenseForm addExpense={addExpense} darkMode={darkMode} />
            </div>
            <div className="card-dashboard summary-card-dashboard hover-grow">
              <ExpenseSummary expenses={expenses} darkMode={darkMode} />
            </div>
          </div>

          <div className="data-section">
            <div className="card-dashboard chart-card hover-grow">
              <div className="chart-header">
                <h2 className="section-title">📊 Spending Overview</h2>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`category-filter ${darkMode ? "dark" : "light"}`}
                >
                  <option value="">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Bills">Bills</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="chart-container">
                <ExpenseChart
                  expenses={filteredExpenses}
                  darkMode={darkMode}
                  isMobile={isMobile}
                />
              </div>
            </div>

            <div className="card-dashboard list-card hover-grow">
              <h2 className="section-title">📝 Recent Expenses</h2>
              <ExpenseList
                expenses={filteredExpenses}
                deleteExpense={deleteExpense}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal moved outside main container */}
      {showModal && (
        <div className="modal-overlay">
          <FlatmateModal close={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
};

export default ExpenseDashboard;