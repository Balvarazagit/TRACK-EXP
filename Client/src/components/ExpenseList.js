import React from 'react';
import "../styles/ExpenseList.css";
import { useAuth } from '../context/AuthContext'; // ⬅️ import AuthContext hook

const ExpenseList = ({ expenses, deleteExpense, darkMode }) => {
  console.log("expense",expenses);
  
  const { user } = useAuth(); // ⬅️ get logged-in user
  console.log("user",user);
  

  if (expenses.length === 0) {
    return (
      <div className="empty-state animate-fade">
        <div className="empty-icon">📭</div>
        <h3>No expenses found</h3>
        <p>Add your first expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="expense-list">
      {expenses.map((exp, index) => (
        <div
          key={exp._id}
          className={`expense-item ${
            darkMode ? "dark" : "light"
          } animate-fade hover-grow`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="expense-icon">{getCategoryIcon(exp.category)}</div>
          <div className="expense-details">
            <span className="expense-title">{exp.title}</span>
            <span className="expense-meta">
              {exp.category} • {new Date(exp.date).toLocaleDateString()}
            </span>
            <span className="expense-addedby">
              👤 {exp.userId?.name || user?.name || "Unknown"}
            </span>
          </div>
          <div className="expense-actions">
            <span className="expense-amount animate-pulse">
              ₹{exp.amount.toFixed(2)}
            </span>

            {/* ✅ Show delete only if this expense belongs to logged-in user */}
            {((exp.userId?._id === user?.id) || (exp?.userId === user?.id)) && (
              <button
                onClick={() => deleteExpense(exp._id)}
                className="delete-btn hover-grow"
                aria-label="Delete expense"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const getCategoryIcon = (category) => {
  switch(category) {
    case 'Food': return '🍔';
    case 'Travel': return '🚕';
    case 'Bills': return '🧾';
    case 'Shopping': return '🛍️';
    case 'Entertainment': return '🎬';
    default: return '💰';
  }
};

export default ExpenseList;
